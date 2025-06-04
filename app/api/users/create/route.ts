import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node"

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user to check if they're admin
    const currentUser = await clerkClient.users.getUser(userId)
    const currentUserRole = currentUser.publicMetadata?.role as string

    if (currentUserRole !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, firstName, lastName, role, sendInvitation } = body

    console.log("Creating user with data:", { email, firstName, lastName, role, sendInvitation })

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields: email, firstName, lastName, role" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["admin", "manager", "inventory", "driver", "employee", "guest"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user with email already exists
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [email],
      })

      if (existingUsers.data.length > 0) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }
    } catch (error) {
      console.error("Error checking existing users:", error)
      return NextResponse.json({ error: "Failed to check existing users" }, { status: 500 })
    }

    let newUser
    let invitationSent = false

    if (sendInvitation) {
      // Send invitation instead of creating user directly
      try {
        console.log("Attempting to send invitation...")

        // Prepare invitation data
        const invitationData: {
          emailAddress: string
          publicMetadata: {
            role: string
            firstName: string
            lastName: string
          }
          redirectUrl?: string
        } = {
          emailAddress: email,
          publicMetadata: {
            role,
            firstName,
            lastName,
          },
        }

        // Add redirect URL if available
        const redirectUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
        if (redirectUrl) {
          invitationData.redirectUrl = redirectUrl
        }

        console.log("Invitation data:", invitationData)

        const invitation = await clerkClient.invitations.createInvitation(invitationData)

        invitationSent = true
        console.log("Invitation sent successfully:", invitation.id)

        return NextResponse.json({
          success: true,
          message: "Invitation sent successfully",
          invitationId: invitation.id,
          email,
          role,
        })
      } catch (invitationError: any) {
        console.error("Error sending invitation:", invitationError)
        console.error("Full invitation error:", {
          status: invitationError.status,
          message: invitationError.message,
          errors: invitationError.errors,
          clerkTraceId: invitationError.clerkTraceId,
        })

        // If invitation fails, try creating user directly instead
        console.log("Invitation failed, attempting to create user directly...")
        try {
          newUser = await clerkClient.users.createUser({
            emailAddress: [email],
            firstName,
            lastName,
            publicMetadata: {
              role,
            },
            skipPasswordChecks: true,
            skipPasswordRequirement: true,
          })

          console.log("User created directly after invitation failure:", newUser.id)
        } catch (directCreationError: any) {
          console.error("Direct user creation also failed:", directCreationError)
          return NextResponse.json(
            {
              error: "Failed to send invitation and create user",
              invitationError: invitationError.errors || invitationError.message,
              creationError: directCreationError.errors || directCreationError.message,
            },
            { status: 500 },
          )
        }
      }
    } else {
      // Create user directly
      try {
        console.log("Creating user directly...")
        newUser = await clerkClient.users.createUser({
          emailAddress: [email],
          firstName,
          lastName,
          publicMetadata: {
            role,
          },
          skipPasswordChecks: true,
          skipPasswordRequirement: true,
        })

        console.log("User created successfully:", newUser.id)
      } catch (userCreationError: any) {
        console.error("Error creating user:", userCreationError)
        return NextResponse.json(
          {
            error: "Failed to create user",
            details: userCreationError.errors || userCreationError.message,
          },
          { status: 500 },
        )
      }
    }

    // Save user to Firebase (only if user was created, not for successful invitations)
    if (newUser) {
      try {
        console.log("Saving user to Firebase...")
        // Import Firebase Admin dynamically to avoid initialization issues
        const { getFirebaseAdminDatabase } = await import("@/app/lib/firebase-admin")
        const database = getFirebaseAdminDatabase()

        const userData = {
          id: newUser.id,
          email,
          firstName,
          lastName,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await database.ref(`users/${newUser.id}`).set(userData)
        console.log("User saved to Firebase successfully")
      } catch (firebaseError) {
        console.error("Error saving user to Firebase:", firebaseError)
        // Continue even if Firebase save fails - user is still created in Clerk
      }
    }

    return NextResponse.json({
      success: true,
      message: invitationSent
        ? "Invitation sent successfully"
        : newUser
          ? "User created successfully"
          : "User processed successfully",
      user: newUser
        ? {
            id: newUser.id,
            email,
            firstName,
            lastName,
            role,
          }
        : {
            email,
            firstName,
            lastName,
            role,
          },
      invitationSent,
    })
  } catch (error: any) {
    console.error("Error in user creation:", error)
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
