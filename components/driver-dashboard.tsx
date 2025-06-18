'use client';

import React, { useMemo } from 'react';

import { useFirebaseData } from '@/app/lib/firebase';
import { format } from 'date-fns';

export function DriverDashboard() {
  const { data: orders } = useFirebaseData('orders');
  const { data: doors } = useFirebaseData('doors');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const todayOrders = useMemo(() => {
    return (
      orders?.filter((order: any) =>
        order.date?.startsWith(todayStr)
      ) || []
    )
  }, [orders, todayStr]);

  const availableDoors = doors?.filter((door: any) => door.status === 'available').length || 0;

  return (
    <div className='grid gap-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'> Livrările de astăzi </h3>
          <p className='text-3xl font-bold mt-2'> {todayOrders.length} </p>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'> Uși disponibile </h3>
          <p className='text-3xl font-bold mt-2'>{availableDoors}</p>
        </div>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>
          Program de livrare
        </h3>

        <div className='space-y-4'>
          {todayOrders.length > 0 ? (
            todayOrders.map((order: any) => (
              <div key={order.id} className='p-3 border rounded-lg'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>Order #{order.id}</span>
                  <span className='px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>
                    {order.deliveryTime || 'Scheduled'}
                  </span>
                </div>
                <p className='text-sm text-muted-foreground mt-1'>{order.address || 'No address provided'}</p>
              </div>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>No deliveries scheduled today.</p>
          )}
        </div>
      </div>
    </div>  
  )
}
