"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { canViewSidebarItem, getRoleName } from "@/app/lib/roles"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  Factory,
  DoorOpenIcon as Door,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  UserCircle,
  UserCog,
} from "lucide-react"

export function Sidebar1() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { toast } = useToast()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && user) {
      // Get user role from Clerk metadata
      const role = (user.publicMetadata.role as string) || "guest"
      setUserRole(role)
    }
  }, [isLoaded, user])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Success",
        description: "You have been logged out",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const menuItems = [
    {
      name: "overview",
      label: "Overview",
      href: "/Admin",
      icon: LayoutDashboard,
    },
    {
      name: "inventory",
      label: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
    },
    {
      name: "orders",
      label: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      name: "drivers",
      label: "Drivers",
      href: "/dashboard/drivers",
      icon: Truck,
    },
    {
      name: "incidents",
      label: "Incidents",
      href: "/dashboard/incidents",
      icon: AlertTriangle,
    },
    {
      name: "production",
      label: "Production",
      href: "/dashboard/production",
      icon: Factory,
    },
    {
      name: "doors",
      label: "Doors",
      href: "/dashboard/doors",
      icon: Door,
    },
    {
      name: "calendar",
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "employees",
      label: "Employees",
      href: "/dashboard/employees",
      icon: Users,
    },
    {
      name: "documents",
      label: "Documents",
      href: "/dashboard/documents",
      icon: FileText,
    },
    // Only show user management to admins
    ...(userRole === "admin"
      ? [
          {
            name: "users",
            label: "User Management",
            href: "/dashboard/users",
            icon: UserCog,
          },
        ]
      : []),
    {
      name: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  if (!isLoaded || !user) {
    return null
  }

  return (
    <div className="w-64 bg-muted h-screen flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">WMS Pro</h2>
        <p className="text-sm text-muted-foreground">{getRoleName(userRole as any)}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {menuItems.map((item) => {
          // Check if user can view this sidebar item
          if (item.name !== "users" && !canViewSidebarItem(userRole as any, item.name)) {
            return null
          }

          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <Link href="/user-profile">
          <Button variant="ghost" className="w-full justify-start">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
