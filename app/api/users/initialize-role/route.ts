import { clerkClient } from "@clerk/clerk-sdk-node"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/app/lib/firebase"
import { ref, set, get } from "firebase/database"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the current user
    const user = await clerkClient.users.getUser(userId)

    // Get the role from the request body or use default
    const body = await request.json().catch(() => ({}))
    const requestedRole = body.role

    // Validate the role if provided
    const validRoles = ["admin", "manager", "inventory", "driver", "employee", "guest"]
    let role = "guest" // Default role

    if (requestedRole && validRoles.includes(requestedRole)) {
      role = requestedRole
    } else {
      // Set default role to admin for the first user, guest for others
      const allUsers = await clerkClient.users.getUserList()
      role = allUsers.data.length === 1 ? "admin" : "guest"
    }

    // Update the user's role in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
    })

    // Also update the user's role in Firebase for consistency
    const userRef = ref(db, `users/${userId}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      // Update existing user
      await set(userRef, {
        ...snapshot.val(),
        role,
      })
    } else {
      // Create new user record
      await set(userRef, {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Role initialized successfully",
      role,
    })
  } catch (error) {
    console.error("Error initializing user role:", error)
    return NextResponse.json({ error: "Failed to initialize user role" }, { status: 500 })
  }
}
