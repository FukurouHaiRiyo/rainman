import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node"
import { NextResponse } from "next/server"
import { db } from "@/app/lib/firebase"
import { ref, update } from "firebase/database"

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  const { userId: targetUserId } = params
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the current user to check if they're an admin
    const currentUser = await clerkClient.users.getUser(userId)
    const userRole = currentUser.publicMetadata.role as string

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get the new role from the request body
    const { role } = await request.json()

    // Validate the role
    const validRoles = ["admin", "manager", "inventory", "driver", "employee", "guest"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update the user's role in Clerk
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: { role },
    })

    // Also update the user's role in Firebase for consistency
    await update(ref(db, `users/${targetUserId}`), { role })

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
