'use client';

import React from 'react';

import { useFirebaseData } from '@/app/lib/firebase';
import { format } from 'date-fns';

export function ManagerDashboard() {
  const { data: inventory } = useFirebaseData('inventory');
  const { data: orders } = useFirebaseData('orders');
  const { data: drivers } = useFirebaseData('drivers');
  const { data: shifts } = useFirebaseData('shifts');
  const { data: incidents } = useFirebaseData('incidents');

  const totalInventory = inventory?.reduce((acc: any, item: any) => acc + (item.quantity || 0), 0) || 0;
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;
  const activeDrivers = drivers?.filter((driver: any) => driver.status === 'active').length || 0;

  const recentIncidents = incidents?.slice(0, 3) || [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayShifts = shifts?.filter((shift: any) => shift.date === today) || [];



  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium'>
          Inventar
        </h3>

        <p className='text-3xl font-bold mt-2'>
          {totalInventory}
        </p>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium'>Pending Orders</h3>
        <p className='text-3xl font-bold mt-2'>{pendingOrders}</p>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium'>Active Drivers</h3>
        <p className='text-3xl font-bold mt-2'>{activeDrivers}</p>
      </div>

      
    </div>
  )
}
