import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try{
    // get the current user and check if they're admin
    const currentUser = await clerkClient.users.getUser(userId);
    const userRole = currentUser.publicMetadata.role as string;

    if (userRole !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role, sendInvitation = true } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Email, first name, last name, and role are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'inventory', 'driver', 'employee', 'guest']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Create user in Clerk
    const newUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      publicMetadata: {
        role,
      },
      skipPasswordChecks: sendInvitation, // Skip password if sending invitation
      skipPasswordRequirement: sendInvitation,
    });

    // Send invitation email if requested
    if (sendInvitation) {
      await clerkClient.invitations.createInvitation({
        emailAddress: email,
        publicMetadata: {
          role,
        },
        redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/dashboard"}`,
      })
    }

    // Return the created user data
    const userData = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.emailAddresses[0]?.emailAddress,
      imageUrl: newUser.imageUrl,
      role: newUser.publicMetadata.role,
      createdAt: newUser.createdAt,
      lastSignInAt: newUser.lastSignInAt,
    }

    return NextResponse.json({ user: userData, invitationSent: sendInvitation });

  } catch(error: any) {
    console.error('Error creating user:', error);

    // Handle specific Clerk errors
    if (error.errors && error.errors[0]) {
      const clerkError = error.errors[0];
      if (clerkError.code === 'form_identifier_exists') {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}