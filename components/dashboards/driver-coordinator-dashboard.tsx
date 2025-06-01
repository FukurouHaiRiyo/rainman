'use client';

import React from 'react';

import { Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';

const DriverCoordinatorDashboard = () => {
  const { data: drivers } = useFirebaseData('drivers');
  const { data: doorActivity } = useFirebaseData('doorActivity');
  const { data: scheduledOrders } = useFirebaseData('scheduledOrders');

  // Calculate driver metrics
  // @typescript-eslint/no-explicit-any
  const checkedInDrivers = drivers?.filter((driver: any) => driver.status === 'checked-in')|| [];
  // @typescript-eslint/no-explicit-any
  const loadingDrivers = drivers?.filter((driver: any) => driver.status === 'loading') || [];
  // @typescript-eslint/no-explicit-any
  const waitingDrivers = drivers?.filter((driver: any) => driver.status === 'waiting') || [];

  // Get active doors 
  // const activeDoors = doorActivity?.filter((door: any) => door.isLatest && door.type === 'open') || [];

  // Get today's scheduled orders
  const today = new Date().toISOString().split('T')[0];
  // @typescript-eslint/no-explicit-any
  // const todaysScheduledOrders = scheduledOrders?.filter((order: any) => {
  //   const orderDate = new Date(order.scheduledDate).toISOString().split('T')[0];
  //   return orderDate === today;
  // }) || [];

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold treacking-tight'> Tabloul de bord pentru coordonarea șoferilor </h2>
      <p className='text-muted-foreground'> Gestionați șoferii, docurile de încărcare și programele de livrare. </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Șoferi activi </CardTitle>
            <Truck className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> {checkedInDrivers?.length + loadingDrivers?.length} </div>
            <p className='text-xs text-muted-foreground'> {waitingDrivers?.length} în așteptarea unei sarcini </p>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}

export default DriverCoordinatorDashboard;