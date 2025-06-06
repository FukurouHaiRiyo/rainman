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
import InventoryOverview from "@/components/inventory/overview"
import OrdersOverview from "@/components/orders/overview"
import DriverCheckIn from "@/components/drivers/check-in"
import IncidentReport from "@/components/incident/report";
import ProductionTimeline from "@/components/production/timeline"
import DoorActivity from "@/components/doors/activity"
import OrderCalendar from "@/components/calendar/scheduler"
import EmployeeScheduler from "@/components/employees/scheduler"
// import DocumentGenerator from "@/components/documents/generator"
import Navbar from '@/components/Navbar'
// import { useUserRole } from "@/contexts/user-context"
import { canViewSidebarItem } from "@/app/lib/roles"
import { useUserRole } from "@/context/user-context"
import { useClerk } from "@clerk/nextjs"
// import RoleDashboard from "@/components/dashboards/role-dashboard"

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
    { id: "overview", label: "Dashboard", icon: BarChart3 },
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
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          {/* <Sidebar>
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
                      isActive={activeTab === item.id}
                      onClick={() => {
                        if (item.href) {
                          window.location.href = item.href
                        } else {
                          setActiveTab(item.id)
                        }
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
                <Button variant="outline" className="w-full" onClick={handleGeneratePdf}>
                  Generate Reports
                </Button>
              </div>

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
            </SidebarFooter>
          </Sidebar> */}

          {role === 'admin' && <Sidebar1 />}
          <div className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  {filteredSidebarItems
                    .filter((item) => !item.href) // Filter out items with href
                    .map((item) => (
                      <TabsTrigger key={item.id} value={item.id}>
                        {item.label}
                      </TabsTrigger>
                    ))}
                </TabsList>
              </div>
              <TabsContent value="overview" className="space-y-4">
                {/* <RoleDashboard /> */}
              </TabsContent>
              <TabsContent value="inventory" className="space-y-4">
                <InventoryOverview />
              </TabsContent>
              <TabsContent value="orders" className="space-y-4">
                <OrdersOverview />
              </TabsContent>
              <TabsContent value="drivers" className="space-y-4">
                <DriverCheckIn />
              </TabsContent>
              <TabsContent value="incidents" className="space-y-4">
                <IncidentReport />
              </TabsContent>
              <TabsContent value="production" className="space-y-4">
                <ProductionTimeline />
              </TabsContent>
              <TabsContent value="doors" className="space-y-4">
                <DoorActivity />
              </TabsContent>
              <TabsContent value="calendar" className="space-y-4">
                <OrderCalendar />
              </TabsContent>
              <TabsContent value="employees" className="space-y-4">
                <EmployeeScheduler />
              </TabsContent>
              <TabsContent value="documents" className="space-y-4">
                {/* <DocumentGenerator /> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
