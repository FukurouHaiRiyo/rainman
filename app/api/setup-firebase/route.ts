import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  }

// This route will initialize the Firebase database with sample data
export async function POST(request: Request) {
    try {
      const db = getDatabase()
      const { data } = await request.json()
  
      // Check if data is provided
      if (!data) {
        return NextResponse.json({ error: "No data provided" }, { status: 400 })
      }
  
      // Write data to Firebase
      await db.ref("/").set(data) 
  
      return NextResponse.json({ success: true, message: "Firebase database initialized with sample data" })
    } catch (error) {
      console.error("Error initializing Firebase database:", error)
      return NextResponse.json({ error: "Failed to initialize Firebase database" }, { status: 500 })
    }
}