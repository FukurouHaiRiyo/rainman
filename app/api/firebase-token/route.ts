import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    console.log("Firebase token API called")

    const { userId } = await auth()

    if (!userId) {
      console.log("No user ID found in request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User ID:", userId)

    const { initializeFirebaseAdmin, admin } = await import("@/app/lib/firebase-admin")
    initializeFirebaseAdmin()

    const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    if (!clerkRes.ok) {
      const errorText = await clerkRes.text()
      console.error("Failed to fetch Clerk user:", clerkRes.status, errorText)
      return NextResponse.json({ error: "Failed to fetch Clerk user" }, { status: 500 })
    }

    const userData = await clerkRes.json()
    const role = userData.public_metadata?.role || "guest"

    const token = await admin.auth().createCustomToken(userId, {
      role,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating Firebase token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
