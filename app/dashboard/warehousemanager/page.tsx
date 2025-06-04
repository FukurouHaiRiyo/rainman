'use client';

import React from 'react';

import { Layers, Package, Truck, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import StatsOverview from '@/components/stats/overview';
import OrdersOverview from '@/components/orders/overview';

const WarehouseManagerDashboard = () => {
  const { data: stats, loading } = useFirebaseData('stats');
  const { data: incidents } = useFirebaseData('incidents');
  const { data: drivers } = useFirebaseData('drivers');

  // Filter recent results 
  const recentIncidents = incidents?.slice(0, 3) || [];

  // Count active drivers
  const activeDrivers = drivers?.filter((driver: any) => driver.status === 'checked-in' || driver.status === 'loading') || []


  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold tracking-tight'> Tabloul de bord manager de depozit </h2>
      <p className='text-muted-foreground'> Monitorizați operațiunile din depozit, personalul și indicatorii cheie. </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Total Inventory </CardTitle>

            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> {stats?.totalInventory} || 0 </div>
            <p className='text-xs text-muted-foreground'>
              {stats?.inventoryChange > 0 ? '+': ''}
              {stats?.inventoryChange || 0} de ieri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Comenzi în așteptare </CardTitle>

            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'>
              {stats?.pendingOrders || 0}
            </div>

            <p className='text-xs text-muted-foreground'>
              {stats?.ordersChange > 0 ? '+' : ''}
              {stats?.ordersChange || 0} de ieri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Drivers</CardTitle>
            <Truck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeDrivers.length}</div>
            <p className='text-xs text-muted-foreground'>{drivers?.length || 0} total drivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Staff On Duty</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>3 managers, 9 staff</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Activitate săptămânală</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsOverview />
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Incidente recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident: any, i: any) => (
                  <div key={i} className='flex items-center justify-between border-b pb-2'>
                    <div>
                      <p className='font-medium'>{incident.title}</p>
                      <p className='text-sm text-muted-foreground'>{incident.location}</p>
                    </div>
                    <div className='text-sm text-right'>
                      <p>{incident.date}</p>
                      <p className='text-muted-foreground'>{incident.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground text-center py-4'>Fără incidente recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comenzi recente</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersOverview />
        </CardContent>
      </Card>
    </div>
  )
}

export default WarehouseManagerDashboard;