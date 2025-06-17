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
        <h3 className='text-lg font-medium'> Comenzi în așteptare </h3>
        <p className='text-3xl font-bold mt-2'>{pendingOrders}</p>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium'>Soferi activi</h3>
        <p className='text-3xl font-bold mt-2'>{activeDrivers}</p>
      </div>

      <div className='rounded-lg border p-6 md:col-span-2'>
        <h3 className='text-lg font-medium mb-4'> Programul angajaților (astăzi) </h3>

        <div className='space-y-2'>
          {todayShifts.length > 0 ? (
            todayShifts.map((shift: any, index: any) => (
              <div key={index} className='flex justify-between items-center'>
                <span>{shift.employee}</span>
                <span>{shift.startTime} - {shift.endTime}</span>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground text-sm'>No scheduled shifts for today.</p>
          )}
        </div>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>
          Incidente recente
        </h3>

        <div className='space-y-2'>
          {recentIncidents.length > 0 ? (
            recentIncidents.map((incident: any, index: any) => (
              <div key={index} className='flex justify-between items-center'>
                <span>{incident.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    incident.severity === 'High'
                      ? 'bg-red-100 text-red-800'
                      : incident.severity === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
            )) 
          ): (
            <p className='text-muted-foreground text-sm'> 
              Fără incidente recente.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
