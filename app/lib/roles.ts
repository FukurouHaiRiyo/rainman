export type UserRole = "admin" | "manager" | "inventory" | "driver" | "employee" | "guest"

export interface RolePermission {
  view: string[]
  edit: string[]
}

export interface RoleDefinition {
  name: string
  description: string
  permissions: RolePermission
  dashboardComponents: string[]
  sidebarItems: string[]
}

export const ROLES: Record<UserRole, RoleDefinition> = {
  admin: {
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: {
      view: ["all"],
      edit: ["all"],
    },
    dashboardComponents: ["stats", "orders", "inventory", "incidents", "production"],
    sidebarItems: [
      "overview",
      "inventory",
      "orders",
      "drivers",
      "incidents",
      "production",
      "doors",
      "calendar",
      "employees",
      "documents",
      "settings",
    ],
  },
  manager: {
    name: "Warehouse Manager",
    description: "Manages overall warehouse operations",
    permissions: {
      view: ["inventory", "orders", "drivers", "incidents", "production", "doors", "calendar", "employees"],
      edit: ["inventory", "orders", "drivers", "incidents", "production", "employees"],
    },
    dashboardComponents: ["stats", "orders", "inventory", "incidents", "drivers"],
    sidebarItems: [
      "overview",
      "inventory",
      "orders",
      "drivers",
      "incidents",
      "production",
      "doors",
      "calendar",
      "employees",
    ],
  },
  inventory: {
    name: "Inventory Specialist",
    description: "Manages inventory and stock levels",
    permissions: {
      view: ["inventory", "orders"],
      edit: ["inventory"],
    },
    dashboardComponents: ["inventory", "stats"],
    sidebarItems: ["overview", "inventory", "orders"],
  },
  driver: {
    name: "Driver",
    description: "Handles deliveries and pickups",
    permissions: {
      view: ["orders", "doors", "driver-checkin"],
      edit: ["driver-checkin"],
    },
    dashboardComponents: ["driver-checkin", "doors"],
    sidebarItems: ["overview", "driver-checkin", "doors"],
  },
  employee: {
    name: "Warehouse Employee",
    description: "General warehouse staff",
    permissions: {
      view: ["inventory", "orders", "schedule"],
      edit: [],
    },
    dashboardComponents: ["schedule", "orders"],
    sidebarItems: ["overview", "inventory", "orders", "schedule"],
  },
  guest: {
    name: "Guest",
    description: "Limited access user",
    permissions: {
      view: ["overview"],
      edit: [],
    },
    dashboardComponents: ["overview"],
    sidebarItems: ["overview"],
  },
}

export function hasPermission(role: UserRole, action: "view" | "edit", resource: string): boolean {
  const roleDefinition = ROLES[role]
  if (!roleDefinition) return false

  return roleDefinition.permissions[action].includes("all") || roleDefinition.permissions[action].includes(resource)
}

export function canViewSidebarItem(role: UserRole, item: string): boolean {
  const roleDefinition = ROLES[role]
  if (!roleDefinition) return false

  return roleDefinition.sidebarItems.includes(item)
}

export function getDashboardComponentsForRole(role: UserRole): string[] {
  return ROLES[role]?.dashboardComponents || []
}

export function getRoleName(role: UserRole): string {
  return ROLES[role]?.name || "User"
}
