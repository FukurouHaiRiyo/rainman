// import Firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import { getdb } from 'firebase/db';
// import { getAuth } from 'firebase/auth';

// 

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: FirebaseAPI_Key,
//     authDomain: FirebaseAuthDomain,
//     dbURL: FirebasedbUrl,
//     projectId: FirebaseProjectID,
//     storageBucket: FireaseStorageBucket,
//     messagingSenderId: FirebaseMessagingSenderId,
//     appId: FirebaseAppId,
//     measurementId: FirebaseMeasurementId
// };

// // Initialize Firebase
// const firebase = Firebase.initializeApp(firebaseConfig);
// const { FieldValue } = Firebase.firestore;

// export const auth = getAuth(firebase);
// export const db = getdb(firebase);

// export { firebase, FieldValue }

"use client"

import Firebase from 'firebase/compat/app';
import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getDatabase, ref, onValue, off, get, set, push, update, remove } from "firebase/database"
import { getStorage } from "firebase/storage"
import { useState, useEffect, useCallback } from "react"

// Firebase configuration from environment variables
const firebaseConfig = {
 apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
  
  // Initialize Firebase
  let app
  let db: any
  let storage
  const firebase = Firebase.initializeApp(firebaseConfig);
  const auth = getAuth(firebase);
  app = initializeApp(firebaseConfig)
  db = getDatabase(app);
  storage = getStorage(app);
  
  if (typeof window !== "undefined" && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    db = getDatabase(app)
    storage = getStorage(app)
    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Update the useFirebaseData hook to include refresh functionality
export function useFirebaseData(path: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  // Function to force a refresh of the data
  const refreshData = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!db) {
      console.error("Firebase database not initialized")
      setLoading(false)
      setError(new Error("Firebase database not initialized"))
      return () => {}
    }

    setLoading(true)
    const dbRef = ref(db, path)

    // Listen for changes
    onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val()
        if (val) {
          // Convert Firebase object to array if it's an object with keys
          if (typeof val === "object" && !Array.isArray(val)) {
            const dataArray = Object.keys(val).map((key) => ({
              id: key,
              ...val[key],
            }))
            setData(dataArray)
          } else {
            setData(val)
          }
        } else {
          setData([])
        }
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching data from ${path}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    // Clean up listener
    return () => {
      off(dbRef)
    }
  }, [path, refreshKey])

  return { data, loading, error, refreshData }
}

// Enhance the firebaseService with better error handling and return values
export const firebaseService = {
  // Create a new item
  create: async (path: string, data: any) => {
    try {
      if (!db) throw new Error("Firebase not initialized")
      const newItemRef = push(ref(db, path))
      await set(newItemRef, data)
      return { success: true, id: newItemRef.key, data: { id: newItemRef.key, ...data } }
    } catch (error) {
      console.error("Error creating item:", error)
      return { success: false, error }
    }
  },

  // Read a single item
  read: async (path: string, id: string) => {
    try {
      if (!db) throw new Error("Firebase not initialized")
      const snapshot = await get(ref(db, `${path}/${id}`))
      if (snapshot.exists()) {
        return { success: true, data: { id, ...snapshot.val() } }
      }
      return { success: false, error: new Error("Item not found") }
    } catch (error) {
      console.error("Error reading item:", error)
      return { success: false, error }
    }
  },

  // Update an existing item
  update: async (path: string, id: string, data: any) => {
    try {
      if (!db) throw new Error("Firebase not initialized")
      await update(ref(db, `${path}/${id}`), data)
      return { success: true, data: { id, ...data } }
    } catch (error) {
      console.error("Error updating item:", error)
      return { success: false, error }
    }
  },

  // Delete an item
  delete: async (path: string, id: string) => {
    try {
      if (!db) throw new Error("Firebase not initialized")
      await remove(ref(db, `${path}/${id}`))
      return { success: true, id }
    } catch (error) {
      console.error("Error deleting item:", error)
      return { success: false, error }
    }
  },
}

// Export Firebase instances
export { auth, app, db, storage }
