"use client"

import { db } from "./firebase";
import { ref, set, push, remove, update, get } from "firebase/database"

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
