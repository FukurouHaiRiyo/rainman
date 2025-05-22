"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { Bell, LogOut, Settings, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/sidebar"
import { useUserRole } from "@/context/user-context"
import { getRoleName } from "@/app/lib/roles"

export function Navbar() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { role } = useUserRole()
  const [notificationsCount] = useState(3) // This would be fetched from your backend

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U"
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    return user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U"
  }

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-2 md:mr-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-xl hidden md:block">WMS Pro</div>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{getRoleName(role)}</span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notificationsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {notificationsCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                <div className="p-2 text-sm">
                  <div className="font-medium">New order received</div>
                  <div className="text-muted-foreground text-xs">Order #ORD-10049 from Acme Corp</div>
                  <div className="text-muted-foreground text-xs mt-1">10 minutes ago</div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-sm">
                  <div className="font-medium">Low inventory alert</div>
                  <div className="text-muted-foreground text-xs">
                    Bubble Wrap Roll (SKU: PKG-BUB-003) is low on stock
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">1 hour ago</div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-sm">
                  <div className="font-medium">New incident reported</div>
                  <div className="text-muted-foreground text-xs">Equipment failure in Warehouse B</div>
                  <div className="text-muted-foreground text-xs mt-1">3 hours ago</div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || "User"} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{getRoleName(role)}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
