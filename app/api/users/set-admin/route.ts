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

    // Set role to admin
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "admin" },
    })

    // Also update the user's role in Firebase for consistency
    const userRef = ref(db, `users/${userId}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      // Update existing user
      await set(userRef, {
        ...snapshot.val(),
        role: "admin",
      })
    } else {
      // Create new user record
      await set(userRef, {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: "admin",
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: "User role set to admin successfully",
    })
  } catch (error) {
    console.error("Error setting user as admin:", error)
    return NextResponse.json({ error: "Failed to set user as admin" }, { status: 500 })
  }
}
