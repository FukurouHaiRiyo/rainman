"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function RoleInitializer() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSettingAdmin, setIsSettingAdmin] = useState(false)

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata.role) {
      // Don't auto-initialize, let the user choose
    }
  }, [isLoaded, user])

  const initializeRole = async (role = "guest") => {
    if (isInitializing || isSettingAdmin) return

    setIsInitializing(true)
    try {
      const response = await fetch("/api/users/initialize-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Role initialized",
          description: `Your role has been set to ${data.role}`,
        })

        // Reload the user to get the updated metadata
        await user?.reload()

        // Force page reload to ensure all components update
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize role",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const setUserAsAdmin = async () => {
    if (!user || isSettingAdmin || isInitializing) return

    setIsSettingAdmin(true)
    try {
      const response = await fetch("/api/users/set-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your role has been set to admin. Reloading user data...",
        })

        // Reload the user to get the updated metadata
        await user.reload()

        // Force page reload to ensure all components update
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set admin role",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting admin role:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSettingAdmin(false)
    }
  }

  if (!isLoaded || user?.publicMetadata.role) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Role Selection Required</h2>
        <p className="mb-6">
          Your user account needs a role to be assigned before you can access the dashboard. Please select a role:
        </p>

        <div className="space-y-4">
          <Button
            onClick={setUserAsAdmin}
            disabled={isSettingAdmin || isInitializing}
            className="w-full"
            variant="default"
          >
            {isSettingAdmin ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Admin Role...
              </>
            ) : (
              "Set as Administrator"
            )}
          </Button>

          <Button
            onClick={() => initializeRole("guest")}
            disabled={isSettingAdmin || isInitializing}
            className="w-full"
            variant="outline"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Guest Role...
              </>
            ) : (
              "Set as Guest"
            )}
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Note: Administrator has full access to all features. Guest has limited access.
        </p>
      </div>
    </div>
  )
}
