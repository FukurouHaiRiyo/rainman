import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Profile | Warehouse Management System",
  description: "User profile information",
}

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    return user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and settings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">User ID</span>
                <span className="text-muted-foreground">{user.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Role</span>
                <span className="text-muted-foreground">Administrator</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Last Sign In</span>
                <span className="text-muted-foreground">
                  {new Date(user.lastSignInAt || Date.now()).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Created</span>
                <span className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Recent activity and system access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Recent Logins</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{new Date().toLocaleString()}</span>
                    <span className="text-muted-foreground">Chrome on Windows</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{new Date(Date.now() - 86400000).toLocaleString()}</span>
                    <span className="text-muted-foreground">Safari on macOS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{new Date(Date.now() - 172800000).toLocaleString()}</span>
                    <span className="text-muted-foreground">Firefox on Windows</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Recent Actions</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Updated inventory item</span>
                    <span className="text-muted-foreground">{new Date(Date.now() - 3600000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Created new order</span>
                    <span className="text-muted-foreground">{new Date(Date.now() - 7200000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Generated shipping documents</span>
                    <span className="text-muted-foreground">{new Date(Date.now() - 10800000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">System Permissions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Inventory Management</div>
                  <div className="text-sm text-right text-green-500">Full Access</div>
                  <div className="text-sm">Order Processing</div>
                  <div className="text-sm text-right text-green-500">Full Access</div>
                  <div className="text-sm">User Management</div>
                  <div className="text-sm text-right text-green-500">Full Access</div>
                  <div className="text-sm">System Configuration</div>
                  <div className="text-sm text-right text-green-500">Full Access</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
