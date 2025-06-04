import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/clerk-sdk-node'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user to check if they're admin
    const currentUser = await clerkClient.users.getUser(userId)
    const currentUserRole = currentUser.publicMetadata?.role as string

    if (currentUserRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { email, firstName, lastName, role, sendInvitation } = body

    console.log('Creating user with data:', { email, firstName, lastName, role, sendInvitation })

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields: email, firstName, lastName, role' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'inventory', 'driver', 'employee', 'guest']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Check if user with email already exists
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [email],
      })

      if (existingUsers.data.length > 0) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
      }
    } catch (error) {
      console.error('Error checking existing users:', error)
      return NextResponse.json({ error: 'Failed to check existing users' }, { status: 500 })
    }

    if (sendInvitation) {
      // Send Clerk invitation
      try {
        console.log('Attempting to send Clerk invitation...')

        const invitation = await clerkClient.invitations.createInvitation({
          emailAddress: email,
          publicMetadata: {
            role,
            firstName,
            lastName,
          },
          redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/dashboard',
        })

        console.log('Clerk invitation sent successfully:', invitation.id)

        // Store invitation metadata in Firebase
        try {
          const { getFirebaseAdminDatabase } = await import('@/app/lib/firebase-admin')
          const database = getFirebaseAdminDatabase()

          const invitationData = {
            email,
            firstName,
            lastName,
            role,
            status: 'invited',
            invitationId: invitation.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          await database.ref(`invitations/${invitation.id}`).set(invitationData)
          console.log('Invitation metadata saved to Firebase')
        } catch (firebaseError) {
          console.error('Error saving invitation metadata:', firebaseError)
          // Continue even if Firebase save fails
        }

        return NextResponse.json({
          success: true,
          message: 'Invitation sent successfully',
          invitationId: invitation.id,
          email,
          role,
          invitationSent: true,
        })
      } catch (invitationError: any) {
        console.error('Clerk invitation failed:', invitationError)

        // Fallback: Create user directly with temporary password
        console.log('Invitation failed, creating user directly...')

        try {
          const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
          const newUser = await clerkClient.users.createUser({
            emailAddress: [email],
            firstName,
            lastName,
            password: tempPassword,
            publicMetadata: {
              role,
              needsPasswordReset: true,
            },
          })

          console.log('User created directly:', newUser.id)

          // Save user to Firebase
          try {
            const { getFirebaseAdminDatabase } = await import('@/app/lib/firebase-admin')
            const database = getFirebaseAdminDatabase()

            const userData = {
              id: newUser.id,
              email,
              firstName,
              lastName,
              role,
              status: 'active',
              needsPasswordReset: true,
              tempPassword: tempPassword,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            await database.ref(`users/${newUser.id}`).set(userData)
            console.log('User saved to Firebase')
          } catch (firebaseError) {
            console.error('Error saving user to Firebase:', firebaseError)
          }

          return NextResponse.json({
            success: true,
            message: 'Invitation failed - User created with temporary password',
            user: {
              id: newUser.id,
              email,
              firstName,
              lastName,
              role,
              tempPassword: tempPassword,
            },
            invitationSent: false,
            note: 'Clerk invitation failed. User created with temporary password. Please share login credentials manually.',
          })
        } catch (directCreationError: any) {
          console.error('Direct user creation also failed:', directCreationError)

          return NextResponse.json(
            {
              error: 'Failed to send invitation and create user',
              details: {
                invitationError: invitationError.message,
                creationError: directCreationError.message,
              },
              suggestion: 'Check Clerk configuration and try again',
            },
            { status: 500 },
          )
        }
      }
    } else {
      // Create user directly
      try {
        console.log('Creating user directly...')

        const newUser = await clerkClient.users.createUser({
          emailAddress: [email],
          firstName,
          lastName,
          publicMetadata: {
            role,
          },
          skipPasswordChecks: true,
          skipPasswordRequirement: true,
        })

        console.log('User created in Clerk:', newUser.id)

        // Save user to Firebase
        try {
          const { getFirebaseAdminDatabase } = await import('@/app/lib/firebase-admin')
          const database = getFirebaseAdminDatabase()

          const userData = {
            id: newUser.id,
            email,
            firstName,
            lastName,
            role,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          await database.ref(`users/${newUser.id}`).set(userData)
          console.log('User saved to Firebase successfully')
        } catch (firebaseError) {
          console.error('Error saving user to Firebase:', firebaseError)
        }

        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          user: {
            id: newUser.id,
            email,
            firstName,
            lastName,
            role,
          },
          invitationSent: false,
        })
      } catch (userCreationError: any) {
        console.error('Error creating user:', userCreationError)
        return NextResponse.json(
          {
            error: 'Failed to create user',
            details: userCreationError.errors || userCreationError.message,
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error('Error in user creation:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error.message || 'Unknown error',
      },
      { status: 500 },
    )
  }
}
