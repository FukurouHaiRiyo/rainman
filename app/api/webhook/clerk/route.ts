import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { db } from '@/app/lib/firebase';
import { ref, set } from 'firebase/database';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get('svix-id');
  const svix_timestamp = (await headerPayload).get('svix-timestamp');
  const svix_signature = (await headerPayload).get('svix-signature');

  // If there are no headers, error out
  if(!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
        status: 400,
    });
  }

  // Get the body 
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try{
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch(err) {
    console.log('Error verifying webhiik: ', err);
    return new Response('Error: Invalid signature', {
        status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    // Get user data from the event
    const { id, email_addresses, first_name, last_name } = evt.data;

    try{
      // set default role to guest in Clerk
      await clerkClient.users.updateUser(id, {
        publicMetadata: { role: 'guest' },
      });

      // create user in Firebase 
      const userData = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        role: 'guest',
        createdAt: new Date().toISOString(),
      }

      // save user data to Firebase
      await (set(ref(db, `users/${id}`), userData));

      console.log(`User created and role set: ${id}`);
    } catch(error) {
      console.log('Error setting up new user: ', error);
    }
  }

  return new Response('Webhook received', { status: 200 });
}