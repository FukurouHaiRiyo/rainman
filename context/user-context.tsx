"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type UserRole, getRoleName } from "@/app/lib/roles"
import { useToast } from "@/hooks/use-toast"

interface UserContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  isLoading: boolean
  roleName: string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // In a real application, you would fetch the user's role from your authentication system
  // For now, we'll use localStorage to persist the selected role for demo purposes
  useEffect(() => {
    const storedRole = localStorage.getItem("wms-user-role") as UserRole | null
    if (storedRole && Object.keys(getRoleName).includes(storedRole)) {
      setRole(storedRole)
    }
    setIsLoading(false)
  }, [])

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole)
    localStorage.setItem("wms-user-role", newRole)
    toast({
      title: "Role changed",
      description: `You are now viewing as ${getRoleName(newRole)}`,
    })
  }

  return (
    <UserContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        isLoading,
        roleName: getRoleName(role),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserProvider")
  }
  return context
}
