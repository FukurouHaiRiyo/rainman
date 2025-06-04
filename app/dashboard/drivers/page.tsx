'use client';

import React from 'react';

import { Calendar, Clock, DoorOpen, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import { Badge } from '@/components/ui/badge';

// driver coordinator page

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
  const activeDoors = doorActivity?.filter((door: any) => door.isLatest && door.type === 'open') || [];

  // Get today's scheduled orders
  const today = new Date().toISOString().split('T')[0];
  // @typescript-eslint/no-explicit-any
  const todaysScheduledOrders = scheduledOrders?.filter((order: any) => {
    const orderDate = new Date(order.scheduledDate).toISOString().split('T')[0];
    return orderDate === today;
  }) || [];

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

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Docuri de încărcare </CardTitle>
            <DoorOpen className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> {activeDoors.length} / 6 </div>
            <p className='text-xs text-muted-foreground'> Docuri active </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Programul de azi </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'>
              {todaysScheduledOrders.length}
            </div>

            <p className='text-xs text-muted-foreground'> Livrări și ridicări programate </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> Timp mediu de așteptare </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> 24 min </div>
            <p className='text-xs text-muted-foreground'> Pentru procesarea șoferului </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle> Șoferi activi </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              {checkedInDrivers.length > 0 ? (
                checkedInDrivers.slice(0, 5).map((driver: any, i: any) => (
                  <div key={i} className='flex items-center justify-between border-b pb-2'>
                    <div>
                      <p className='font-medium'>{driver.name}</p>
                      <p className='text-sm text-muted-foreground'>{driver.company}</p>
                    </div>

                    <div className='text-right'>
                      <Badge variant={driver.status === 'checked-in'? 'default': driver.status === 'loading' ? 'secondary': 'outline'}>
                        {driver.status}
                      </Badge>

                      <p className='text-sm text-muted-foreground mt-1'> Camion: {driver.truckId} </p>
                    </div>
                  </div>
                ))
              ): (
                <p className='text-muted-foreground text-center py-4'> 
                  Fără șoferi activi
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> Door status </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              {Array(6).fill(0).map((_, i) => {
                const doorNumber = i + 1;
                const doorData = doorActivity?.find((d: any) => d.doorId === `D${doorNumber}` && d.isLatest);
                const isOpen = doorData?.type === 'open';
                const hasAlarm = doorData?.hasAlarm;

                return (
                  <Card key={i} className={`overflow-hidden ${hasAlarm ? 'border-red-500': ''}`}>
                    <CardHeader className='p-2'>
                      <CardTitle className='text-sm flex items-center justify-between'>
                        <span> Door {doorNumber} </span>
                        {hasAlarm && <Badge variant='destructive'> Alarma </Badge>}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className='p-2'>
                      <div className='flex items-center justify-between'>
                        <Badge variant={isOpen ? 'default' : 'outline'}>{isOpen ? 'Deschis' : 'Închis'}</Badge>
                        <span className='text-xs text-muted-foreground'>
                          {doorData?.associatedOrder || 'Fără comandă'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programul de azi</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            {todaysScheduledOrders.length > 0 ? (
              todaysScheduledOrders.slice(0, 5).map((order: any, i: any) => (
                <div key={i} className='flex items-center justify-between border-b pb-2'>
                  <div>
                    <p className='font-medium'>{order.orderId}</p>
                    <p className='text-sm text-muted-foreground'>{order.customer}</p>
                  </div>
                  <div className='text-right'>
                    <Badge variant={order.type === 'inbound' ? 'outline' : 'secondary'}>
                      {order.type === 'inbound' ? 'Inbound' : 'Outbound'}
                    </Badge>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {order.timeSlot === 'morning'
                        ? 'Dimineaţă'
                        : order.timeSlot === 'afternoon'
                          ? 'După-amiază'
                          : 'Seară'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-center py-4'>No scheduled orders for today</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DriverCoordinatorDashboard;