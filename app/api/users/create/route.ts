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

    const { email, firstName, lastName, role, sendInvitation } = await request.json()

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields: email, firstName, lastName, role" }, { status: 400 })
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
      try {
        const invitation = await clerkClient.invitations.createInvitation({
          emailAddress: email,
          publicMetadata: {
            role,
          },
          redirectUrl:
            process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ||
            `${process.env.NEXT_PUBLIC_APP_URL || "https://rainman-beta.vercel.app"}/dashboard`,
        });

        if (!invitation || !invitation.id) {
          throw new Error("Clerk did not return a valid invitation ID.");
        }

        console.log("Invitation sent successfully:", invitation.id);

        return NextResponse.json({
          success: true,
          message: "Invitation sent successfully",
          invitationId: invitation.id,
        });

      } catch (invitationError: any) {
        console.error("Error sending invitation:", invitationError);
        return NextResponse.json(
          {
            error: "Failed to send invitation",
            details: invitationError.errors || invitationError.message,
          },
          { status: 500 }
        );
      }
    } else {
      // Create user directly
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

    // Save user to Firebase (only if user was created, not for invitations)
    if (newUser) {
      try {
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
      message: `User ${sendInvitation ? "invitation sent" : "created"} successfully`,
      user: newUser
        ? {
          id: newUser.id,
          email,
          firstName,
          lastName,
          role,
        }
        : undefined,
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
