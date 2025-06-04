import type { NextRequest } from "next/server"
import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { getFirebaseAdminDatabase } from "@/app/lib/firebase-admin"

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = (await headerPayload).get("svix-id")
  const svix_timestamp = (await headerPayload).get("svix-timestamp")
  const svix_signature = (await headerPayload).get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created") {
    try {
      const { id, email_addresses, first_name, last_name, public_metadata } = evt.data

      // Get the database instance
      const database = getFirebaseAdminDatabase()

      // Create user data
      const userData = {
        id,
        email: email_addresses[0]?.email_address || "",
        firstName: first_name || "",
        lastName: last_name || "",
        role: public_metadata?.role || "guest",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }

      // Save user to Firebase
      await database.ref(`users/${id}`).set(userData)

      // Update stats
      await database.ref(`stats/totalUsers`).transaction((current: any) => (current || 0) + 1)
      await database.ref(`stats/usersByRole/${userData.role}`).transaction((current: any) => (current || 0) + 1)

      // If this user was invited, update the invitation status
      if (public_metadata?.invitationId) {
        await database.ref(`invitations/${public_metadata.invitationId}`).update({
          status: "accepted",
          userId: id,
          acceptedAt: new Date().toISOString(),
        })
      }

      console.log("User created and saved to Firebase:", userData)
    } catch (error) {
      console.error("Error saving user to Firebase:", error)
      // Don't return an error response as this might cause Clerk to retry
    }
  }

  if (eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name, public_metadata } = evt.data

      // Get the database instance
      const database = getFirebaseAdminDatabase()

      // Update user data
      const userData = {
        email: email_addresses[0]?.email_address || "",
        firstName: first_name || "",
        lastName: last_name || "",
        role: public_metadata?.role || "guest",
        updatedAt: new Date().toISOString(),
      }

      // Update user in Firebase
      await database.ref(`users/${id}`).update(userData)

      console.log("User updated in Firebase:", userData)
    } catch (error) {
      console.error("Error updating user in Firebase:", error)
      // Don't return an error response as this might cause Clerk to retry
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data

      // Get the database instance
      const database = getFirebaseAdminDatabase()

      // Get user data before deletion for stats update
      const userSnapshot = await database.ref(`users/${id}`).once("value")
      const userData = userSnapshot.val()

      // Remove user from Firebase
      await database.ref(`users/${id}`).remove()

      // Update stats
      if (userData) {
        await database.ref(`stats/totalUsers`).transaction((current: any) => Math.max((current || 1) - 1, 0))
        await database
          .ref(`stats/usersByRole/${userData.role}`)
          .transaction((current: any) => Math.max((current || 1) - 1, 0))
      }

      console.log("User deleted from Firebase:", id)
    } catch (error) {
      console.error("Error deleting user from Firebase:", error)
      // Don't return an error response as this might cause Clerk to retry
    }
  }

  return new Response("", { status: 200 })
}
