import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const currentUser = await clerkClient.users.getUser(userId);
    const userRole = currentUser.publicMetadata.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    // @typescript-eslint/no-unused-vars
    const { email, firstName, lastName, role, sendInvitation = true } = body;

    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Email, first name, last name, and role are required' }, { status: 400 });
    }

    const validRoles = ['admin', 'manager', 'inventory', 'driver', 'employee', 'guest'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // 🔍 Check if user or invitation already exists
    const existingUsersResponse = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (existingUsersResponse.data && existingUsersResponse.data.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    // ✅ Only send invitation
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: { role, firstName, lastName },
      redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}`,
    });

    return NextResponse.json({ invitationSent: true, invitation });

  } catch (error: any) {
    console.error('Error sending invitation:', error);

    if (error?.errors?.[0]?.code === 'form_identifier_exists') {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
