import { clerkClient } from '@clerk/clerk-sdk-node';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: { [key: string]: string } }
) {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the current user to check if they're an admin
    const currentUser = await clerkClient.users.getUser(currentUserId);
    const userRole = currentUser.publicMetadata.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUserId = context.params.userId;

    // Get the user to send invitation to
    const targetUser = await clerkClient.users.getUser(targetUserId);
    const userEmail = targetUser.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    // Send invitation
    await clerkClient.invitations.createInvitation({
      emailAddress: userEmail,
      publicMetadata: targetUser.publicMetadata,
      redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard'}`,
    });

    return NextResponse.json({ success: true, message: 'Invitation sent successfully' });
  } catch (error: any) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}
