import { NextResponse } from "next/server"
import { getFirebaseAdminDatabase, checkFirebaseAdminConfig } from "@/app/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    // Check Firebase Admin configuration first
    const configCheck = await checkFirebaseAdminConfig()

    if (!configCheck.success) {
      console.error("Firebase Admin configuration error:", configCheck.message)
      return NextResponse.json(
        {
          error: "Firebase Admin configuration failed",
          details: configCheck.message,
          config: configCheck.config,
        },
        { status: 500 },
      )
    }

    // Get the database instance
    const database = getFirebaseAdminDatabase()

    const { data } = await request.json()

    // Check if data is provided
    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Write data to Firebase
    await database.ref("/").set(data)

    return NextResponse.json({
      success: true,
      message: "Firebase database initialized with sample data",
    })
  } catch (error) {
    console.error("Error initializing Firebase database:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize Firebase database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
