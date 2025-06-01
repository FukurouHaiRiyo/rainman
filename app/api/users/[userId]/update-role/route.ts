import { clerkClient } from "@clerk/clerk-sdk-node"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/app/lib/firebase"
import { ref, set } from "firebase/database"

export async function PATCH(request: Request, context: any) {
  try {
    const { userId: currentUserId } = await auth()

    if (!currentUserId) {
      console.log("No current user ID found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Current user ID:", currentUserId)

    // Get the current user to check if they're an admin
    const currentUser = await clerkClient.users.getUser(currentUserId)
    const userRole = currentUser.publicMetadata.role as string

    console.log("Current user role:", userRole)

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const userId = context.params.userId
    const body = await request.json()
    const { role } = body

    console.log("Updating user:", userId, "to role:", role)

    // Validate role
    const validRoles = ["admin", "manager", "inventory", "driver", "employee", "guest"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    })

    console.log("Updated user role in Clerk successfully")

    // Also update in Firebase for consistency (non-critical)
    try {
      const userRef = ref(db, `users/${userId}`)
      await set(userRef, {
        role: role,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUserId,
      })
      console.log("Updated user role in Firebase successfully")
    } catch (firebaseError) {
      console.warn("Failed to update role in Firebase (non-critical):", firebaseError)
      // Don't fail the request if Firebase update fails
    }

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      userId,
      role,
    })
  } catch (error: any) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      {
        error: "Failed to update user role",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
