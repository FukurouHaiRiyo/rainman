"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { ref, get, set } from "firebase/database"
import { auth, db, onAuthStateChanged } from "@/app/lib/firebase";

// Define user roles
export type UserRole = "admin" | "manager" | "inventory" | "driver" | "employee" | "guest"

// User data interface
interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  role: UserRole
  permissions: string[]
}

// Auth context interface
interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      setUser(user)

      if (user) {
        try {
          // Fetch user data from the database
          const userRef = ref(db, `users/${user.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            const data = snapshot.val()
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: data.role || "guest",
              permissions: data.permissions || [],
            })
          } else {
            // If user doesn't exist in the database, create a new entry
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: "guest",
              permissions: [],
            }
            await set(userRef, newUserData)
            setUserData(newUserData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, userData, loading }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
