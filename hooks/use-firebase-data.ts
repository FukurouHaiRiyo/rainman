"use client"

import { useState, useEffect, useCallback } from "react"
import { ref, onValue, off, get, set, push, update, remove } from "firebase/database"
import { db } from "@/app/lib/firebase"

// Hook to fetch data from Firebase
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
    const handleData = (snapshot: any) => {
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
