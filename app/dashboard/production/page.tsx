'use client';

import React, { useState } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils';

export default function ProductionTimeline() {
  const [date, setDate] = useState<Date>(new Date());
  const { data: productionData, loading } = useFirebaseData('production');

  const formattedDate = format(date, 'MMMM d, yyyy');
  const dayEvents = productionData?.filter((event: any) => {
    const eventDate = new Date(event.startTime)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  });

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  }

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Cronologia producției
          </h2>

          <p className='text-sm text-muted-foreground'> Monitorizează activitățile și programele de producție </p>
        </div>

        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4' />
                {formattedDate}
              </Button>
            </PopoverTrigger>

            <PopoverContent className='w-auto p-0'>
              <Calendar mode='single' selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousDay}>
           <ChevronLeft className='h-4 w-4 mr-2' />
            Ziua anterioară
        </Button>

        <Button variant='outline' size='sm' onClick={handleNextDay}>
          Ziua următoare
          <ChevronRight className='h-4 w-4 ml-2' />
        </Button>
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle> Program de producție pentru {formattedDate} </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ): dayEvents && dayEvents.length > 0 ? (
            <div className='relative'>
              <div className='absolute top-0 bottom-0 left-[70px] w-px bg-border' />

              <div className='space-y-8'>
                {dayEvents.map((event: any, index: any) => (
                  <div key={index} className='relative grid grid-cols-[70px_1fr] gap-4'>
                    <time className='text-sm tabular-nums text-muted-foreground pt-1'>
                      {format(new Date(event.startTime), 'HH:mm')}
                    </time>

                    <div className='absolute left-[70px] w-3 h-3 rounded-full bg-primary -translate-x-1.5 translate-y-1' />

                    
                  </div>
                ))}
              </div>
            </div>
          ): (
            <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
              <Clock className='h-8 w-8 mb-2' />
              <p>Nu sunt programate activități de producție pentru această zi</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
