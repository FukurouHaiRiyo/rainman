'use client'

import { Layers, Package, Truck, ClipboardList } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirebaseData } from '@/app/lib/firebase'
import StatsOverview from '@/components/stats/overview'
import OrdersOverview from '@/components/orders/overview'

export default function AdminDashboard() {
  // @typescript-eslint/no-unused-vars
  const { data: stats, loading } = useFirebaseData('stats')

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold tracking-tight'>Administrator Dashboard</h2>
      <p className='text-muted-foreground'>
        Welcome to the administrator dashboard. You have full access to all system features.
      </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Inventory</CardTitle>
            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.totalInventory || 0}</div>
            <p className='text-xs text-muted-foreground'>
              {stats?.inventoryChange > 0 ? '+' : ''}
              {stats?.inventoryChange || 0} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending Orders</CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.pendingOrders || 0}</div>
            <p className='text-xs text-muted-foreground'>
              {stats?.ordersChange > 0 ? '+' : ''}
              {stats?.ordersChange || 0} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Drivers</CardTitle>
            <Truck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.activeDrivers || 0}</div>
            <p className='text-xs text-muted-foreground'>
              {stats?.driversChange > 0 ? '+' : ''}
              {stats?.driversChange || 0} from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Incidents</CardTitle>
            <ClipboardList className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats?.incidents || 0}</div>
            <p className='text-xs text-muted-foreground'>
              {stats?.incidentsChange > 0 ? '+' : ''}
              {stats?.incidentsChange || 0} from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsOverview />
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersOverview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
