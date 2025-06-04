"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth as useClerkAuth } from "@clerk/nextjs"
import { type User, signInWithCustomToken, signOut } from "firebase/auth"
import { auth } from "@/app/lib/firebase"

interface FirebaseAuthContextType {
  firebaseUser: User | null
  loading: boolean
  error: Error | null
  signOutFromFirebase: () => Promise<void>
  retrySignIn: () => void
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  firebaseUser: null,
  loading: true,
  error: null,
  signOutFromFirebase: async () => {},
  retrySignIn: () => {},
})

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded: isClerkLoaded, isSignedIn } = useClerkAuth()
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [lastRetryTime, setLastRetryTime] = useState(0)
  const signInAttemptRef = useRef(false)

  const MAX_RETRIES = 3
  const RETRY_DELAY = 5000 // 5 seconds

  // Sign out from Firebase
  const signOutFromFirebase = async () => {
    try {
      await signOut(auth)
      setFirebaseUser(null)
      setError(null)
      setRetryCount(0)
      signInAttemptRef.current = false
    } catch (error) {
      console.error("Error signing out from Firebase:", error)
      setError(error as Error)
    }
  }

  // Sign in to Firebase with custom token
  const signInToFirebase = async (isRetry = false) => {
    // Prevent multiple simultaneous sign-in attempts
    if (signInAttemptRef.current && !isRetry) {
      console.log("Firebase sign-in already in progress, skipping...")
      return
    }

    // Check retry limits
    if (retryCount >= MAX_RETRIES) {
      console.log("Max retries reached for Firebase sign-in")
      setLoading(false)
      return
    }

    // Check retry delay
    const now = Date.now()
    if (isRetry && now - lastRetryTime < RETRY_DELAY) {
      console.log("Retry delay not met, skipping...")
      return
    }

    try {
      signInAttemptRef.current = true
      setLoading(true)
      setError(null)

      console.log(`Attempting Firebase sign-in (attempt ${retryCount + 1}/${MAX_RETRIES})...`)

      // Get custom token from API
      const response = await fetch("/api/firebase-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get Firebase token: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()

      if (!data.token) {
        throw new Error("No token returned from API")
      }

      // Sign in to Firebase with custom token
      const userCredential = await signInWithCustomToken(auth, data.token)
      setFirebaseUser(userCredential.user)
      setError(null)
      setRetryCount(0)
      setLastRetryTime(0)
      console.log("Successfully signed in to Firebase with custom token")
    } catch (error) {
      console.error("Error signing in to Firebase:", error)
      setError(error as Error)
      setRetryCount((prev) => prev + 1)
      setLastRetryTime(Date.now())
    } finally {
      setLoading(false)
      signInAttemptRef.current = false
    }
  }

  // Manual retry function
  const retrySignIn = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(0)
      setLastRetryTime(0)
      signInToFirebase(true)
    }
  }

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setFirebaseUser(user)
      if (!user && !signInAttemptRef.current) {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Sign in to Firebase when Clerk user is signed in
  useEffect(() => {
    if (
      isClerkLoaded &&
      isSignedIn &&
      userId &&
      !firebaseUser &&
      !signInAttemptRef.current &&
      retryCount < MAX_RETRIES
    ) {
      const now = Date.now()
      if (now - lastRetryTime >= RETRY_DELAY || lastRetryTime === 0) {
        signInToFirebase()
      }
    }
  }, [isClerkLoaded, isSignedIn, userId, firebaseUser, retryCount, lastRetryTime])

  // Sign out from Firebase when Clerk user signs out
  useEffect(() => {
    if (isClerkLoaded && !isSignedIn && firebaseUser) {
      signOutFromFirebase()
    }
  }, [isClerkLoaded, isSignedIn, firebaseUser])

  return (
    <FirebaseAuthContext.Provider value={{ firebaseUser, loading, error, signOutFromFirebase, retrySignIn }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export const useFirebaseAuth = () => useContext(FirebaseAuthContext)
