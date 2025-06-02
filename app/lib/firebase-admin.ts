// Import firebase-admin differently to avoid import issues
import admin from "firebase-admin"

interface FirebaseAdminConfig {
  projectId: string
  clientEmail: string
  privateKey: string
}

/**
 * Processes the private key to handle different formats and ensure proper PEM formatting
 */
function processPrivateKey(): string {
  // Check if we have a base64 encoded key first
  const base64Key = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
  const directKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  let privateKey = ""

  if (base64Key) {
    try {
      console.log("Attempting to decode base64 private key...")
      // Decode the base64 key
      privateKey = Buffer.from(base64Key, "base64").toString("utf8")
      console.log("Base64 decoding successful")
      console.log("Decoded key preview:", privateKey.substring(0, 50) + "...")
    } catch (error) {
      console.error("Failed to decode base64 private key:", error)
      throw new Error("Failed to decode base64 private key")
    }
  } else if (directKey) {
    console.log("Using direct private key...")
    privateKey = directKey
  } else {
    throw new Error("No private key found. Set either FIREBASE_ADMIN_PRIVATE_KEY or FIREBASE_ADMIN_PRIVATE_KEY_BASE64")
  }

  // Clean up the private key
  let processedKey = privateKey.trim()

  // Handle escaped newlines (\\n) by replacing them with actual newlines (\n)
  processedKey = processedKey.replace(/\\n/g, "\n")

  // Remove any extra quotes that might have been added
  processedKey = processedKey.replace(/^["']|["']$/g, "")

  // Ensure the key has proper PEM format
  if (!processedKey.includes("-----BEGIN PRIVATE KEY-----")) {
    console.error("Private key does not contain PEM header")
    throw new Error("Private key must contain '-----BEGIN PRIVATE KEY-----' header")
  }

  if (!processedKey.includes("-----END PRIVATE KEY-----")) {
    console.error("Private key does not contain PEM footer")
    throw new Error("Private key must contain '-----END PRIVATE KEY-----' footer")
  }

  console.log("Private key validation successful")
  return processedKey
}

/**
 * Validates the Firebase Admin configuration
 */
function validateConfig(config: FirebaseAdminConfig): void {
  if (!config.projectId) {
    throw new Error("Firebase Admin project ID is required (FIREBASE_ADMIN_PROJECT_ID)")
  }

  if (!config.clientEmail) {
    throw new Error("Firebase Admin client email is required (FIREBASE_ADMIN_CLIENT_EMAIL)")
  }

  if (!config.privateKey) {
    throw new Error("Firebase Admin private key is required")
  }

  console.log("Configuration validation successful:")
  console.log("- Project ID:", config.projectId)
  console.log("- Client Email:", config.clientEmail)
  console.log("- Private Key Length:", config.privateKey.length)
}

/**
 * Gets the Firebase Admin configuration from environment variables
 */
function getFirebaseAdminConfig(): FirebaseAdminConfig {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL

  if (!projectId || !clientEmail) {
    throw new Error("Missing required Firebase Admin environment variables")
  }

  const privateKey = processPrivateKey()

  const config = {
    projectId,
    clientEmail,
    privateKey,
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
      console.log("Initializing Firebase Admin...")

      // Check if admin is properly imported
      if (!admin || typeof admin.initializeApp !== "function") {
        throw new Error("Firebase Admin SDK not properly imported")
      }

      const config = getFirebaseAdminConfig()

      const app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      })

      console.log("Firebase Admin initialized successfully")
      return app
    } catch (initError: any) {
      console.error("Failed to initialize Firebase Admin:", initError)
      console.error("Error details:", {
        message: initError.message,
        stack: initError.stack,
      })
      throw new Error(`Firebase Admin initialization failed: ${initError.message}`)
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
    const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    const hasBase64Key = !!process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
    const hasDirectKey = !!process.env.FIREBASE_ADMIN_PRIVATE_KEY

    if (!projectId || !clientEmail || (!hasBase64Key && !hasDirectKey)) {
      return {
        success: false,
        message: "Missing required Firebase Admin configuration",
        config: {
          projectId: projectId || "MISSING",
          clientEmail: clientEmail || "MISSING",
          privateKeyPreview: hasBase64Key ? "BASE64_KEY_SET" : hasDirectKey ? "DIRECT_KEY_SET" : "MISSING",
          databaseURL: databaseURL || "MISSING",
        },
      }
    }

    // Try to process the private key
    const privateKey = processPrivateKey()

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
        privateKeyPreview: `${privateKey.substring(0, 30)}...`,
        databaseURL: databaseURL || "MISSING",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Firebase Admin configuration check failed: ${error.message}`,
      error: {
        message: error.message,
        stack: error.stack,
      },
    }
  }
}

// Export the admin module for direct access
export { admin }
