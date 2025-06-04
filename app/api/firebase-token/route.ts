import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Firebase token API called')

    // Get the current user from Clerk
    const { userId } = await auth()

    if (!userId) {
      console.log('No user ID found in request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User ID:', userId)

    // Check if Firebase Admin is properly configured
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
      console.error('Missing Firebase Admin environment variables')
      return NextResponse.json(
        {
          error: 'Firebase Admin not configured',
          details: 'Missing required environment variables',
        },
        { status: 500 },
      )
    }

    // Dynamic import to avoid initialization issues
    const { initializeFirebaseAdmin, admin } = await import('@/app/lib/firebase-admin')

    // Initialize Firebase Admin
    console.log('Initializing Firebase Admin...')
    const app = initializeFirebaseAdmin()
    console.log('Firebase Admin initialized successfully')

    // Get user data from Clerk
    console.log('Fetching user data from Clerk...')
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to fetch user data from Clerk:', response.status, errorText)
      throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
    }

    const userData = await response.json()
    console.log('User data fetched successfully')

    // Get user role from metadata
    const role = userData.public_metadata?.role || 'guest'
    console.log('User role:', role)

    // Create custom token with user data
    console.log('Creating Firebase custom token...')
    const token = await admin.auth().createCustomToken(userId, {
      role,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
    })

    console.log('Firebase custom token created successfully')
    return NextResponse.json({ token })
  } catch (error: any) {
    console.error('Error in Firebase token API:', error)
    console.error('Error stack:', error.stack)

    return NextResponse.json(
      {
        error: 'Failed to create Firebase token',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
