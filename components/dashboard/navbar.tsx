"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/sidebar"
import { getRoleName } from "@/app/lib/roles"

export function Navbar() {
  const { userData } = useAuth()
  const [notifications, setNotifications] = useState(3)

  const handleSignOut = async () => {
    try {
    //   await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!userData) return "U"
    if (userData.displayName) {
      const nameParts = userData.displayName.split(" ")
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`
      }
      return userData.displayName[0]
    }
    return userData.email?.[0] || "U"
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="ml-auto flex items-center gap-4">
          {userData && (
            <Badge variant="outline" className="hidden md:flex">
              {getRoleName(userData.role)}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {notifications}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">New order received</span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Low stock alert</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Driver check-in</span>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => setNotifications(0)}>
                Mark all as read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{userData?.displayName || userData?.email}</span>
                  <span className="text-xs font-normal text-muted-foreground">{userData?.email}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {getRoleName(userData?.role || "guest")}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
