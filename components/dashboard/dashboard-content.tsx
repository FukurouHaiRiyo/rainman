'use client'

import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardContent() {
  const { userData } = useAuth()

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Warehouse Management System</CardTitle>
          <CardDescription>
            You are logged in as {userData?.email} with role: {userData?.role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select an option from the sidebar to get started.</p>
        </CardContent>
      </Card>

      <div className='mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>Manage your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and manage your inventory items.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Process inbound and outbound orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage your warehouse orders.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Drivers</CardTitle>
            <CardDescription>Manage driver check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track and manage driver activities.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
