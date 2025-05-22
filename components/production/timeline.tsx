'use client';

import React, { useState } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils'

const ProductionTimeline = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { data: productionData, loading } = useFirebaseData('production');

  const formattedDate = format(date, 'MMMM d, yyyy');
  const dayEvents = productionData?.filter((event: any) => {
    const eventDate = new Date(event.startTime);
    return(
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
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
          <h2 className='text-2xl font-semibold tracking-tight'>Cronologia producției</h2>

          <p className='text-sm text-muted-foreground'>Monitorizează activitățile și programele de producție</p>
        </div>

        <div className='flex items-center'>
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

      <div className='flex items-center justify-between p-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousDay}>
          <ChevronLeft className='h-4 w-4 mr-2' />
          Ziua anterioară
        </Button>

        <Button variant='outline' size='sm' onClick={handleNextDay}>
          <ChevronRight className='h-4 w-4 mr-2' />
          Ziua următoare
        </Button>
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>Program de producție pentru</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : dayEvents && dayEvents.length > 0 ? (
            <div className='relative'>
              <div className='absolute top-0 bottom-0 left-[70px] w-px bg-border' />
              <div className='space-y-8'>
                {dayEvents.map((event: any, index: any) => (
                  <div key={index} className='relative grid grid-cols-[70px_1fr] gap-4'>
                    <time className='text-sm tabular-nums text-muted-foreground pt-1'>
                      {format(new Date(event.startTime), 'HH:mm')}
                    </time>
                    <div className='absolute left-[70px] w-3 h-3 rounded-full bg-primary -translate-x-1.5 translate-y-1' />
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-medium leading-none'>{event.title}</h3>
                        <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Clock className='h-4 w-4' />
                        <span>
                          {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                        </span>
                      </div>
                      <p className='text-sm text-muted-foreground'>{event.description}</p>
                      <div className='flex flex-wrap gap-2'>
                        {event.tags.map((tag: any, tagIndex: any) => (
                          <Badge key={tagIndex} variant='outline'>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {event.progress !== undefined && (
                        <div className='w-full mt-2'>
                          <div className='text-xs text-muted-foreground mb-1'>Progres: {event.progress}%</div>
                          <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                            <div
                              className={cn(
                                'h-full rounded-full',
                                event.progress < 30
                                  ? 'bg-red-500'
                                  : event.progress < 70
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500',
                              )}
                              style={{ width: `${event.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'default'
    case 'in progress':
      return 'secondary'
    case 'scheduled':
      return 'outline'
    case 'delayed':
      return 'destructive'
    default:
      return 'outline'
  }
}

export default ProductionTimeline;