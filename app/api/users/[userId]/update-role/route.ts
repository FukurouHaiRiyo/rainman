import { clerkClient } from '@clerk/clerk-sdk-node'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/app/lib/firebase'
import { ref, update } from 'firebase/database'

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId: targetUserId } = params
    const { userId } = await auth()

    console.log('Update role request:', { targetUserId, currentUserId: userId })

    if (!userId) {
      console.log('No user ID in auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user to check if they're an admin
    const currentUser = await clerkClient.users.getUser(userId)
    const userRole = currentUser.publicMetadata.role as string

    console.log('Current user role:', userRole)

    if (userRole !== 'admin') {
      console.log('User is not admin')
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get the new role from the request body
    const body = await request.json()
    const { role } = body

    console.log('New role to set:', role)

    // Validate the role
    const validRoles = ['admin', 'manager', 'inventory', 'driver', 'employee', 'guest']
    if (!validRoles.includes(role)) {
      console.log('Invalid role:', role)
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update the user's role in Clerk
    console.log('Updating user role in Clerk...')
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: { role },
    })

    console.log('User role updated in Clerk successfully')

    // Also update the user's role in Firebase for consistency
    try {
      console.log('Updating user role in Firebase...')
      await update(ref(db, `users/${targetUserId}`), { role })
      console.log('User role updated in Firebase successfully')
    } catch (firebaseError) {
      console.error('Firebase update failed (non-critical):', firebaseError)
      // Don't fail the request if Firebase update fails
    }

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error('Error updating user role:', error)

    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to update user role',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
  }
}
