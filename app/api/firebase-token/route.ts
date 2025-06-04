import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin, admin } from '@/app/lib/firebase-admin';

export async function GET(){
  try{
    // Get the user id from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, {
        status: 401,
      });
    }

    // Initialize Firebase Admin
    initializeFirebaseAdmin();

    // Get user Data from Clerk to include in the token
    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
    }

    const userData = await response.json();

    // Get user role from metadata
    const role = userData.public_metadata?.role || 'guest';

    // Create custom token with user data
    const token = await admin.auth().createCustomToken(userId, {
      role,
      email: userData.email_addresses?.[0]?.email_address,
      firstName: userData.first_name,
      lastName: userData.last_name,
    });

    return NextResponse.json({ token });
  } catch(error: any) {
    console.log('Error creating Firebase token: ', error);
    return NextResponse.json({ error: 'Failed to create Firebase token', details: error.message }, { status: 500 });
  }
}