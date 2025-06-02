'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { getDatabase, ref, onValue, off, get, set, push, update, remove } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { useState, useEffect, useCallback } from 'react'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)

console.log('Firebase initialized with config:', {
  apiKey: process.env.FIREBASE_API_KEY ? 'set' : 'not set',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN ? 'set' : 'not set',
  databaseURL: process.env.FIREBASE_DATABASE_URL ? 'set' : 'not set',
  projectId: process.env.FIREBASE_PROJECT_ID ? 'set' : 'not set',
})

// Authentication functions
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const signOut = () => {
  return firebaseSignOut(auth)
}

// Custom hook for authentication state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, loading }
}

// Custom hook for user roles
export function useUserRole(uid: string | undefined) {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db || !uid) {
      setLoading(false)
      return
    }

    const userRoleRef = ref(db, `users/${uid}/role`)

    // @typescript-eslint/no-explicit-any
    const handleData = (snapshot: any) => {
      const userRole = snapshot.val()
      setRole(userRole)
      setLoading(false)
    }

    onValue(userRoleRef, handleData)

    return () => {
      off(userRoleRef, 'value', handleData)
    }
  }, [uid, db])

  return { role, loading }
}

// Custom hook for Firebase data
export function useFirebaseData(path: string) {
  // @typescript-eslint/no-explicit-any
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
      console.error('Firebase database not initialized')
      setLoading(false)
      setError(new Error('Firebase database not initialized'))
      return () => {}
    }

    setLoading(true)
    const dbRef = ref(db, path)

    // Listen for changes
    // @typescript-eslint/no-explicit-any
    const handleData = (snapshot: any) => {
      const val = snapshot.val()
      if (val) {
        // Convert Firebase object to array if it's an object with keys
        if (typeof val === 'object' && !Array.isArray(val)) {
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
    }

    const handleError = (err: Error) => {
      console.error(`Error fetching data from ${path}:`, err)
      setError(err)
      setLoading(false)
    }

    onValue(dbRef, handleData, handleError)

    // Clean up listener
    return () => {
      off(dbRef)
    }
  }, [path, refreshKey])

  return { data, loading, error, refreshData }
}

// Firebase service for CRUD operations
export const firebaseService = {
  // Create a new item
  // @typescript-eslint/no-explicit-any
  create: async (path: string, data: any) => {
    try {
      if (!db) throw new Error('Firebase not initialized')
      const newItemRef = push(ref(db, path))
      await set(newItemRef, data)
      return { success: true, id: newItemRef.key, data: { id: newItemRef.key, ...data } }
    } catch (error) {
      console.error('Error creating item:', error)
      return { success: false, error }
    }
  },

  // Read a single item
  read: async (path: string, id: string) => {
    try {
      if (!db) throw new Error('Firebase not initialized')
      const snapshot = await get(ref(db, `${path}/${id}`))
      if (snapshot.exists()) {
        return { success: true, data: { id, ...snapshot.val() } }
      }
      return { success: false, error: new Error('Item not found') }
    } catch (error) {
      console.error('Error reading item:', error)
      return { success: false, error }
    }
  },

  // Update an existing item
  // @typescript-eslint/no-explicit-any
  update: async (path: string, id: string, data: any) => {
    try {
      if (!db) throw new Error('Firebase not initialized')
      await update(ref(db, `${path}/${id}`), data)
      return { success: true, data: { id, ...data } }
    } catch (error) {
      console.error('Error updating item:', error)
      return { success: false, error }
    }
  },

  // Delete an item
  delete: async (path: string, id: string) => {
    try {
      if (!db) throw new Error('Firebase not initialized')
      await remove(ref(db, `${path}/${id}`))
      return { success: true, id }
    } catch (error) {
      console.error('Error deleting item:', error)
      return { success: false, error }
    }
  },
}

// Export Firebase instances
export { app, auth, db, storage, onAuthStateChanged }
