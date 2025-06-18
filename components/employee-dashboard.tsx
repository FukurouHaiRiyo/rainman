'use client';

import React from 'react';

import { useFirebaseData } from '@/app/lib/firebase';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';

export function EmployeeDashboard() {
  const { user } = useUser();
  const { data: allShifts } = useFirebaseData('shifts');
  const { data: allTasks } = useFirebaseData('tasks');

  const userId = user?.id;
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayTasks = allTasks?.filter((task: any) => task.userId === userId && task.date === today) || [];

  const completedTasks = todayTasks.filter((task: any) => task.status === 'completed');

  const userSchedule = allShifts?.filter((entry: any) => entry.userId === userId) || [];
  
  return (
    <div className='grid gap-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'>
            Sarcinile de astăzi
          </h3>

          <p className='text-3xl font-bold mt-2'>
            {todayTasks.length}
          </p>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='text-lg font-medium'>Sarcini finalizate</h3>
          <p className='text-3xl font-bold mt-2'>{completedTasks.length}</p>
        </div>
      </div>

      <div className='rounded-lg border p-6'>
        <h3 className='text-lg font-medium mb-4'>
          Programul dvs.
        </h3>

        <div className='space-y-2'>
          {userSchedule.length > 0 ? (
            userSchedule.map((entry: any) => (
              <div key={`${entry.date}-${entry.shift}`} className='flex justify-between items-center'>
                <span>{entry.date}</span>
                <span>{entry.shift.charAt(0).toUpperCase() + entry.shift.slice(1)}</span>
              </div>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>Nu sunt alocate ture.</p>
          )}
        </div>
      </div>
    </div>
  )
}
