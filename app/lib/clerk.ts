import { clerkClient, auth } from "@clerk/nextjs/server"

// Function to get user role from Firebase based on Clerk user ID
export async function getUserRole(userId: string | null) {
  if (!userId) return null

  try {
    // Get public metadata from Clerk user
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata.role || "guest"
  } catch (error) {
    console.error("Error fetching user role:", error)
    return "guest"
  }
}

// Function to check if user has permission
export function hasPermission(userRole: string | null, permission: string) {
  if (!userRole) return false
  if (userRole === "admin") return true

  // Define permissions for each role
  const rolePermissions: Record<string, string[]> = {
    admin: ["all"],
    manager: [
      "view:inventory",
      "edit:inventory",
      "view:orders",
      "edit:orders",
      "view:employees",
      "edit:employees",
      "view:reports",
      "edit:reports",
    ],
    inventory: ["view:inventory", "edit:inventory", "view:orders"],
    driver: ["view:orders", "view:doors", "edit:driver-checkin"],
    employee: ["view:inventory", "view:orders", "view:schedule"],
    guest: [],
  }

  return rolePermissions[userRole]?.includes(permission) || false
}

// Function to get current user ID from auth
export async function getCurrentUserId() {
  const { userId } = await auth()
  return userId
}
