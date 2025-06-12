'use client';

import React, { useState } from 'react';
import { CalendarIcon, DoorOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const DoorActivity = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState('all');
  const { data: doorActivity, loading } = useFirebaseData('doorActivity');
  
  const formattedDate = format(date, 'MMMM d, yyyy');
  const filteredActivity = doorActivity?.filter((activity: any) => {
    const activityDate = new Date(activity.timestamp)
    return (
      activityDate.getDate() === date.getDate() &&
      activityDate.getMonth() === date.getMonth() &&
      activityDate.getFullYear() === date.getFullYear() &&
      (view === 'all' || activity.type === view)
    );
  });

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'> Door Activity </h2>
          <p className='text-sm text-muted-foreground'> Docul de încărcare a șenilelor și utilizarea ușii depozitului </p>
        </div>  

        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className='flex items-cente gap-2'>
                <CalendarIcon className='h-4 w-4' />
                {formattedDate}
              </Button>
            </PopoverTrigger>

            <PopoverContent className='w-auto p-0 radix-dialog-content'>
              <Calendar mode='single' selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue='all' onValueChange={setView} className='space-y-4 mt-4'>
        <TabsList>
          <TabsTrigger value='all'>Activitate</TabsTrigger>
          <TabsTrigger value='open'>Door Open</TabsTrigger>
          <TabsTrigger value='close'>Door Close</TabsTrigger>
          <TabsTrigger value='alarm'>Alarme</TabsTrigger>
        </TabsList>
        <TabsContent value='all' className='space-y-4'>
          <DoorActivityTable activities={filteredActivity} loading={loading} />
        </TabsContent>
        <TabsContent value='open' className='space-y-4'>
          <DoorActivityTable activities={filteredActivity} loading={loading} />
        </TabsContent>
        <TabsContent value='close' className='space-y-4'>
          <DoorActivityTable activities={filteredActivity} loading={loading} />
        </TabsContent>
        <TabsContent value='alarm' className='space-y-4'>
          <DoorActivityTable activities={filteredActivity} loading={loading} />
        </TabsContent>
      </Tabs>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle> Prezentare generală </CardTitle>
        </CardHeader>

        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className='flex items-center justify-center p-8'>
                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                  </Card>
                ))
            ): (  
              <>
                {Array(6).fill(0).map((_, i) => {
                  const doorNumber = i + 1;
                  const doorData = doorActivity?.find((d: any) => d.doorId === `D${doorNumber}` && d.isLatest);
                  const isOpen = doorData?.type === 'open';
                  const hasAlarm = doorData?.hasAlarm;

                  return (
                    <Card key={i} className={cn('overflow-hidden', hasAlarm && 'border-red-500')}>
                      <CardHeader className='p-4 pb-2'>
                        <CardTitle className='text-lg flex items-center justify-between'>
                          <span>Door {doorNumber}</span>
                          {hasAlarm && <Badge variant='destructive'>Alarm</Badge>}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className='p-4 pt-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <DoorOpen 
                              className={cn('h-8 w-8', isOpen ? 'text-green-500': 'text-muted-foreground', hasAlarm && 'text-red-500')}
                            />

                            <div>
                              <p className='font-medium'>{isOpen ? 'Open': 'Closed'}</p>
                              <p className='text-xs text-muted-foreground'>
                                Ultima activitate:{" "}
                                {doorData?.timestamp ? format(new Date(doorData.timestamp), "HH:mm"): 'Unknown'}
                              </p>
                            </div>
                          </div>

                          <Badge variant={isOpen ? 'default': 'outline'}>
                            {doorData?.associatedOrder || "No Order"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function DoorActivityTable({ activities, loading }: { activities: any[]; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle> Activity Log </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ): (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ora</TableHead>
                <TableHead>Door</TableHead>
                <TableHead>Activitate</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Comanda asociata</TableHead>
                <TableHead>Durata</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {activities && activities.length > 0 ? (
                activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(activity.timestamp), 'HH:mm:ss')}</TableCell>
                    <TableCell>Door {activity.doorId.replace('D', '')}</TableCell>

                    <TableCell>
                      <Badge variant={activity.type === 'open' ? 'default': activity.type === 'close' ? 'outline': 'destructive'}>
                        {activity.type === 'open' ? 'Door Open' : activity.type === 'close' ? 'Door Close' : 'Alarm'}
                      </Badge>
                    </TableCell>

                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.associatedOrder || 'N/A'}</TableCell>
                    <TableCell>{activity.duration || 'N/A'}</TableCell>
                    <TableCell>
                      {activity.hasAlarm ? (
                        <Badge variant='destructive'>Alarm</Badge>
                      ) : (
                        <Badge variant='outline'>Normal</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ):(
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                      <DoorOpen className='h-8 w-8 mb-2' />
                      <p>Nu a fost găsită nicio activitate pentru această dată</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export default DoorActivity;