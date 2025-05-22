"use client"

import { type ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  BarChart3,
  Box,
  Calendar,
  ClipboardList,
  Clock,
  DoorOpen,
  FileText,
  Layers,
  LogOut,
  Package,
  Settings,
  Truck,
  Users,
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { canViewSidebarItem } from "@/app/lib/roles"
import { Navbar } from "@/components/dashboard/navbar"
import { Loader2 } from "lucide-react"

export function DashboardShell({ children }: { children: ReactNode }) {
  const { userData, loading } = useAuth()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("overview")

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Define sidebar items
  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3, href: "/dashboard" },
    { id: "inventory", label: "Inventory", icon: Layers, href: "/dashboard/inventory" },
    { id: "orders", label: "Orders", icon: Package, href: "/dashboard/orders" },
    { id: "drivers", label: "Driver Check-in", icon: Truck, href: "/dashboard/drivers" },
    { id: "incidents", label: "Incident Reports", icon: ClipboardList, href: "/dashboard/incidents" },
    { id: "production", label: "Production Timeline", icon: Clock, href: "/dashboard/production" },
    { id: "doors", label: "Door Activity", icon: DoorOpen, href: "/dashboard/doors" },
    { id: "calendar", label: "Order Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { id: "employees", label: "Employee Scheduler", icon: Users, href: "/dashboard/employees" },
    { id: "documents", label: "Documents", icon: FileText, href: "/dashboard/documents" },
    { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ]

  // Filter sidebar items based on user role
  const filteredSidebarItems = userData ? sidebarItems.filter((item) => canViewSidebarItem(userData.role, item.id)) : []

  const handleSignOut = async () => {
    try {
    //   await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <Box className="h-6 w-6" />
                <span className="font-bold">WMS Pro</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {filteredSidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === item.id}
                      onClick={() => {
                        setActiveItem(item.id)
                        router.push(item.href)
                      }}
                    >
                      <button>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="p-4">
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
