"use client"

import { useState } from "react"
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  DoorOpen,
  FileText,
  Layers,
  Package,
  Truck,
  Users,
  Settings,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
} from "@/components/sidebar"
import { Sidebar1 } from "@/components/dashboard/sidebar"
import { useToast } from "@/hooks/use-toast"
import StatsOverview from "@/components/stats/overview"
import Navbar from '@/components/Navbar'
// import { useUserRole } from "@/contexts/user-context"
import { canViewSidebarItem } from "@/app/lib/roles"
import { useUserRole } from "@/context/user-context"
import { useClerk } from "@clerk/nextjs"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const { role, isLoading } = useUserRole()
  const { signOut } = useClerk()

  const handleGeneratePdf = () => {
    toast({
      title: "Generating PDF",
      description: "Your document is being generated...",
    })
    // PDF generation logic would go here
  }

  // Define sidebar items
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "inventory", label: "Inventory", icon: Layers },
    { id: "orders", label: "Orders", icon: Package },
    { id: "drivers", label: "Driver Check-in", icon: Truck },
    { id: "incidents", label: "Incident Reports", icon: ClipboardList },
    { id: "production", label: "Production Timeline", icon: Clock },
    { id: "doors", label: "Door Activity", icon: DoorOpen },
    { id: "calendar", label: "Order Calendar", icon: Calendar },
    { id: "employees", label: "Employee Scheduler", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ]

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter((item) => canViewSidebarItem(role, item.id));

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

  return (
    <>
      <StatsOverview />
    </>
  )
}
