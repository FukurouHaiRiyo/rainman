'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { getRoleName } from '@/app/lib/roles'
// import { ManagerDashboard } from '@/components/dashboards/manager-dashboard'
import InventoryDashboard from '../dashboard/inventory/page';
// import { DriverDashboard } from '@/components/dashboards/driver-dashboard'
// import { EmployeeDashboard } from '@/components/dashboards/employee-dashboard'
// import { GuestDashboard } from '@/components/dashboards/guest-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import Dashboard from '@/components/dashboard'
import { UserProvider } from '@/context/user-context'
import GuestDashboard from './guest/page';

// @typescript-eslint/no-unused-vars
// @typescript-eslint/no-explicit-any
export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isDebugVisible, setIsDebugVisible] = useState(false)
  const [isSettingAdmin, setIsSettingAdmin] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      // Get user role from Clerk metadata
      const role = (user.publicMetadata.role as string) || 'guest'
      console.log('User role from metadata:', role)
      setUserRole(role)
    }
  }, [isLoaded, user])

  const setUserAsAdmin = async () => {
    if (!user || isSettingAdmin) return

    setIsSettingAdmin(true)
    try {
      const response = await fetch('/api/users/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your role has been set to admin. Reloading user data...',
        })

        // Reload the user to get the updated metadata
        await user.reload()

        // Update the role state
        setUserRole('admin')

        // Force page reload to ensure all components update
        window.location.reload()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to set admin role',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error setting admin role:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSettingAdmin(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Render different dashboard based on user role
  const renderDashboard = () => {
    console.log('Rendering dashboard for role:', userRole)

    switch (userRole) {
      case 'admin':
        return <Dashboard />
      case 'manager':
        // return <ManagerDashboard />
      case 'inventory':
        return <InventoryDashboard />
      case 'driver':
        // return <DriverDashboard />
      case 'employee':
        // return <EmployeeDashboard />
      case 'guest':
      default:
        return <GuestDashboard />
    }
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>{getRoleName(userRole as any)} Dashboard</h1>
        <div className='flex gap-2'>
          {/* <Button variant='outline' onClick={() => setIsDebugVisible(!isDebugVisible)}>
            {isDebugVisible ? 'Hide Debug' : 'Show Debug'}
          </Button> */}
        </div>
      </div>

      {isDebugVisible && (
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Role Debug Information</CardTitle>
            <CardDescription>Use this information to troubleshoot role issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div>
                <strong>User ID:</strong> {user.id}
              </div>
              <div>
                <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
              </div>
              <div>
                <strong>Role from metadata:</strong> {String(user.publicMetadata.role || 'undefined')}
              </div>
              <div>
                <strong>Current role state:</strong> {userRole || 'undefined'}
              </div>
              <div>
                <strong>All metadata:</strong>{' '}
                <pre className='bg-muted p-2 rounded text-xs overflow-auto'>
                  {JSON.stringify(user.publicMetadata, null, 2)}
                </pre>
              </div>
              <div className='pt-4 flex gap-2'>
                <Button
                  onClick={async () => {
                    try {
                      await user.reload()
                      const role = (user.publicMetadata.role as string) || 'guest'
                      setUserRole(role)
                      console.log('User reloaded, new role:', role)
                      toast({
                        title: 'User Reloaded',
                        description: `Current role: ${role || 'undefined'}`,
                      })
                    } catch (error) {
                      console.error('Error reloading user:', error)
                      toast({
                        title: 'Error',
                        description: 'Failed to reload user data',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  Reload User Data
                </Button>
                <Button variant='default' onClick={setUserAsAdmin} disabled={isSettingAdmin || userRole === 'admin'}>
                  {isSettingAdmin ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Setting Admin...
                    </>
                  ) : (
                    'Set as Admin'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <UserProvider>
        {renderDashboard()}
      </UserProvider>
    </div>
  )
}
