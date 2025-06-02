import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node"
import { getFirebaseAdminDatabase } from "@/app/lib/firebase-admin"

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

    const { email, firstName, lastName, role, sendInvitation } = await request.json()

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields: email, firstName, lastName, role" }, { status: 400 })
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

    // Create user in Clerk
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

    // Save user to Firebase
    try {
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
    } catch (firebaseError) {
      console.error("Error saving user to Firebase:", firebaseError)
      // Continue even if Firebase save fails
    }

    // Send invitation if requested
    if (sendInvitation) {
      try {
        await clerkClient.invitations.createInvitation({
          emailAddress: email,
          redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard"}`,
          publicMetadata: {
            role,
          },
        })
      } catch (invitationError) {
        console.error("Error sending invitation:", invitationError)
        // Continue even if invitation fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `User created successfully${sendInvitation ? " and invitation sent" : ""}`,
      user: {
        id: newUser.id,
        email,
        firstName,
        lastName,
        role,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
