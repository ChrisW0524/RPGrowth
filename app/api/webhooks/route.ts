import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Extract relevant user data from the event payload
  const { id, email_addresses, last_sign_in_at } = evt.data;
  const email = email_addresses?.[0]?.email_address; // Extract first email address

  if (!email) {
    console.error('Error: Missing email in payload');
    return new Response('Error: Missing email in payload', {
      status: 400,
    });
  }

  try {
    // Upsert the user in the database
    await prisma.user.upsert({
      where: { id },
      update: {
        email,
        updatedAt: new Date(last_sign_in_at), // Update the `updatedAt` field
      },
      create: {
        id,
        email,
        password: '', // Placeholder, replace or hash if needed
        createdAt: new Date(), // Set to now since this is a new user
        updatedAt: new Date(last_sign_in_at),
        exp: 0, // Default initial value
        gold: 0, // Default initial value
      },
    });

    console.log(`User with ID ${id} has been successfully upserted.`);
    return new Response('User updated successfully', { status: 200 });
  } catch (err) {
    console.error('Error: Could not update user in the database:', err);
    return new Response('Error: Database update failed', {
      status: 500,
    });
  }
}
