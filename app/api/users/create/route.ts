import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/app/lib/firebase"
import { ref, set } from "firebase/database"
import { clerkClient } from "@clerk/clerk-sdk-node"

export async function POST(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth()

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the current user to check if they're an admin
    const currentUser = await clerkClient.users.getUser(currentUserId)
    const userRole = currentUser.publicMetadata.role as string

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, firstName, lastName, role, sendInvitation } = body

    console.log("Creating user with data:", { email, firstName, lastName, role, sendInvitation })

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["admin", "manager", "inventory", "driver", "employee", "guest"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    try {
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [email],
      })

      if (existingUsers.data && existingUsers.data.length > 0) {
        return NextResponse.json({ error: "A user with this email address already exists" }, { status: 409 })
      }
    } catch (error) {
      console.error("Error checking existing users:", error)
      // Continue with user creation if check fails
    }

    let newUser
    let invitationSent = false

    if (sendInvitation) {
      // Create invitation instead of user directly
      try {
        const invitation = await clerkClient.invitations.createInvitation({
          emailAddress: email,
          publicMetadata: { role },
          redirectUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard",
        })

        invitationSent = true
        console.log("Invitation created successfully:", invitation.id)

        return NextResponse.json({
          success: true,
          message: "User invitation sent successfully",
          invitationSent: true,
          invitationId: invitation.id,
        })
      } catch (invitationError: any) {
        console.error("Error creating invitation:", invitationError)
        return NextResponse.json(
          {
            error: "Failed to send invitation",
            details: invitationError.message,
          },
          { status: 500 },
        )
      }
    } else {
      // Create user directly
      try {
        newUser = await clerkClient.users.createUser({
          emailAddress: [email],
          firstName,
          lastName,
          publicMetadata: { role },
        })

        console.log("User created successfully:", newUser.id)

        // Also create user record in Firebase
        try {
          const userRef = ref(db, `users/${newUser.id}`)
          await set(userRef, {
            email,
            firstName,
            lastName,
            role,
            createdAt: new Date().toISOString(),
            createdBy: currentUserId,
          })
          console.log("User record created in Firebase")
        } catch (firebaseError) {
          console.warn("Failed to create user record in Firebase (non-critical):", firebaseError)
        }

        return NextResponse.json({
          success: true,
          message: "User created successfully",
          user: {
            id: newUser.id,
            email: newUser.emailAddresses[0]?.emailAddress,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role,
          },
          invitationSent: false,
        })
      } catch (userCreationError: any) {
        console.error("Error creating user:", userCreationError)
        return NextResponse.json(
          {
            error: "Failed to create user",
            details: userCreationError.message,
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error("Unexpected error in user creation:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
