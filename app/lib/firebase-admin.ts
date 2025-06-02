import * as admin from "firebase-admin"

interface FirebaseAdminConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

/**
 * Processes the private key to handle different formats and ensure proper PEM formatting
 */
function processPrivateKey(privateKey: string): string {
  // Check if we have a base64 encoded key first
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
  if (base64Key) {
    try {
      // Try to decode the base64 key
      const decodedKey = Buffer.from(base64Key, "base64").toString("utf8")
      console.log("Using base64 decoded private key")
      return decodedKey
    } catch (error) {
      console.error("Failed to decode base64 private key:", error)
      // Fall back to regular key
    }
  }

  // Handle escaped newlines (\\n) by replacing them with actual newlines (\n)
  let processedKey = privateKey.replace(/\\n/g, "\n")

  // If the key doesn't start with the PEM header, add it
  if (!processedKey.includes("-----BEGIN PRIVATE KEY-----")) {
    processedKey = `-----BEGIN PRIVATE KEY-----\n${processedKey}\n-----END PRIVATE KEY-----\n`
  }

  return processedKey
}

/**
 * Validates the Firebase Admin configuration
 */
function validateConfig(config: FirebaseAdminConfig): void {
  if (!config.projectId) {
    throw new Error("Firebase Admin project ID is required")
  }

  if (!config.clientEmail) {
    throw new Error("Firebase Admin client email is required")
  }

  if (!config.privateKey) {
    throw new Error("Firebase Admin private key is required")
  }

  // Basic validation for private key format
  const key = config.privateKey
  if (!key.includes("PRIVATE KEY")) {
    console.warn('Warning: Private key may not be properly formatted. It should include "PRIVATE KEY" text.')
  }
}

/**
 * Gets the Firebase Admin configuration from environment variables
 */
export default function getFirebaseAdminConfig(): FirebaseAdminConfig {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ""

  if (!projectId) {
    throw new Error("Firebase Admin project ID is required")
  }
  if (!clientEmail) {
    throw new Error("Firebase Admin client email is required")
  }

  const config: FirebaseAdminConfig = {
    projectId,
    clientEmail,
    privateKey: processPrivateKey(privateKey),
  }

  validateConfig(config)
  return config
}

/**
 * Initializes the Firebase Admin SDK if it hasn't been initialized already
 */
export function initializeFirebaseAdmin(): admin.app.App {
  try {
    // Check if Firebase Admin is already initialized
    return admin.app()
  } catch (error) {
    // Firebase Admin is not initialized, so initialize it
    try {
      const config = getFirebaseAdminConfig()

      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      })
    } catch (initError) {
      console.error("Failed to initialize Firebase Admin:", initError)
      const errorMessage = (initError instanceof Error) ? initError.message : String(initError)
      throw new Error(`Firebase Admin initialization failed: ${errorMessage}`)
    }
  }
}

/**
 * Gets the Firebase Admin app instance
 */
export function getFirebaseAdminApp(): admin.app.App {
  return initializeFirebaseAdmin()
}

/**
 * Gets the Firebase Admin database instance
 */
export function getFirebaseAdminDatabase(): admin.database.Database {
  const app = getFirebaseAdminApp()
  return app.database()
}

/**
 * Gets the Firebase Admin auth instance
 */
export function getFirebaseAdminAuth(): admin.auth.Auth {
  const app = getFirebaseAdminApp()
  return app.auth()
}

/**
 * Utility function to check if Firebase Admin is properly configured
 */
export async function checkFirebaseAdminConfig(): Promise<{
  success: boolean
  message: string
  config?: {
    projectId: string
    clientEmail: string
    privateKeyPreview: string
    databaseURL: string
  }
  error?: any
}> {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ""
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL

    if (!projectId || !clientEmail || !privateKey) {
      return {
        success: false,
        message: "Missing required Firebase Admin configuration",
        config: {
          projectId: projectId || "MISSING",
          clientEmail: clientEmail || "MISSING",
          privateKeyPreview: privateKey ? `${privateKey.substring(0, 15)}...` : "MISSING",
          databaseURL: databaseURL || "MISSING",
        },
      }
    }

    // Try to initialize Firebase Admin
    const app = initializeFirebaseAdmin()

    // Test database connection
    const db = app.database()
    const testRef = db.ref("/__test__")
    await testRef.set({
      timestamp: admin.database.ServerValue.TIMESTAMP,
      message: "Firebase Admin test successful",
    })

    return {
      success: true,
      message: "Firebase Admin is properly configured",
      config: {
        projectId,
        clientEmail,
        privateKeyPreview: `${privateKey.substring(0, 15)}...`,
        databaseURL: databaseURL || "",
      },
    }
  } catch (error) {
    return {
      success: false,
      message: `Firebase Admin configuration check failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      error: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    }
  }
}

// Export the admin module for direct access
export { admin }
