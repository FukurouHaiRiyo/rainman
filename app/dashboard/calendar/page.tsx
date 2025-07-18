'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Package, Plus, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirebaseData } from '@/app/lib/firebase'
import { Badge } from '@/components/ui/badge'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function OrderCalendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  // @typescript-eslint/no-unused-vars
  const { data: scheduledOrders, loading } = useFirebaseData('scheduledOrders')
  const { toast } = useToast()

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startDate, i)
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
      fullDate: format(day, 'yyyy-MM-dd'),
    }
  })

  // Group orders by date and time slot
  const ordersByDay = weekDays.map((day) => {
    // @typescript-eslint/no-explicit-any
    const dayOrders = scheduledOrders?.filter((order: any) => {
      const orderDate = format(new Date(order.scheduledDate), 'yyyy-MM-dd')
      return orderDate === day.fullDate
    })

    // Group by time slot (morning, afternoon, evening)
    // @typescript-eslint/no-explicit-any
    const morning = dayOrders?.filter((order: any) => order.timeSlot === 'morning') || []
    const afternoon = dayOrders?.filter((order: any) => order.timeSlot === 'afternoon') || []
    const evening = dayOrders?.filter((order: any) => order.timeSlot === 'evening') || []

    return {
      ...day,
      orders: {
        morning,
        afternoon,
        evening,
      },
    }
  })

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Order Calendar</h2>
          <p className='text-sm text-muted-foreground'>Schedule and manage inbound and outbound orders</p>
        </div>
        <div className='flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Schedule Order
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px] radix-dialog-content'>
              <DialogHeader>
                <DialogTitle>Schedule New Order</DialogTitle>
                <DialogDescription>Add a new order to the calendar.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='orderType' className='text-right'>
                    Order Type
                  </Label>
                  <Select>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select order type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='inbound'>Inbound</SelectItem>
                      <SelectItem value='outbound'>Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='orderId' className='text-right'>
                    Order ID
                  </Label>
                  <Input id='orderId' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='customer' className='text-right'>
                    Customer
                  </Label>
                  <Input id='customer' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>
                    Date
                  </Label>
                  <Input id='date' type='date' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='timeSlot' className='text-right'>
                    Time Slot
                  </Label>
                  <Select>
                    <SelectTrigger className='col-span-3 radix-dialog-content'>
                      <SelectValue placeholder='Select time slot' />
                    </SelectTrigger>
                    <SelectContent className='radix-dialog-content'>
                      <SelectItem value='morning'>Morning (8:00 - 12:00)</SelectItem>
                      <SelectItem value='afternoon'>Afternoon (12:00 - 16:00)</SelectItem>
                      <SelectItem value='evening'>Evening (16:00 - 20:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='items' className='text-right'>
                    Items Count
                  </Label>
                  <Input id='items' type='number' className='col-span-3' />
                </div>
                <div className='grid grid-cols-4 items-start gap-4'>
                  <Label htmlFor='notes' className='text-right pt-2'>
                    Notes
                  </Label>
                  <Textarea id='notes' className='col-span-3' />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type='submit'
                  onClick={() => {
                    setOpen(false)
                    toast({
                      title: 'Order scheduled',
                      description: 'The order has been added to the calendar.',
                    })
                  }}
                >
                  Schedule Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousWeek}>
          <ChevronLeft className='h-4 w-4 mr-2' />
          Previous Week
        </Button>
        <div className='text-sm font-medium'>
          {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
        </div>
        <Button variant='outline' size='sm' onClick={handleNextWeek}>
          Next Week
          <ChevronRight className='h-4 w-4 ml-2' />
        </Button>
      </div>
      <div className='grid grid-cols-7 gap-4 mt-4'>
        {ordersByDay.map((day, index) => (
          <Card key={index} className='overflow-hidden'>
            <CardHeader className='p-3'>
              <CardTitle className='text-center'>
                <div className='text-sm font-normal text-muted-foreground'>{day.dayName}</div>
                <div className='text-xl'>{day.dayNumber}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-3 space-y-4'>
              <div>
                <h4 className='text-xs font-medium text-muted-foreground mb-1'>Morning</h4>
                {day.orders.morning.length > 0 ? (
                  <div className='space-y-2'>
                    {/* @typescript-eslint/no-explicit-any */}
                    {day.orders.morning.map((order: any, i: any) => (
                      <OrderCard key={i} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className='h-12 border border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground'>
                    No orders
                  </div>
                )}
              </div>
              <div>
                <h4 className='text-xs font-medium text-muted-foreground mb-1'>Afternoon</h4>
                {day.orders.afternoon.length > 0 ? (
                  <div className='space-y-2'>
                    {/* @typescript-eslint/no-explicit-any */}
                    {day.orders.afternoon.map((order: any, i: any) => (
                      <OrderCard key={i} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className='h-12 border border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground'>
                    No orders
                  </div>
                )}
              </div>
              <div>
                <h4 className='text-xs font-medium text-muted-foreground mb-1'>Evening</h4>
                {day.orders.evening.length > 0 ? (
                  <div className='space-y-2'>
                    {/* @typescript-eslint/no-explicit-any */}
                    {day.orders.evening.map((order: any, i: any) => (
                      <OrderCard key={i} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className='h-12 border border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground'>
                    No orders
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

function OrderCard({ order }: { order: any }) {
  return (
    <div className='p-2 border rounded-md text-xs'>
      <div className='flex items-center justify-between mb-1'>
        <Badge variant={order.type === 'inbound' ? 'outline' : 'secondary'} className='text-[10px] px-1 py-0'>
          {order.type === 'inbound' ? 'In' : 'Out'}
        </Badge>
        <span className='font-medium'>{order.orderId}</span>
      </div>
      <div className='flex items-center gap-1'>
        {order.type === 'inbound' ? (
          <Truck className='h-3 w-3 text-green-500' />
        ) : (
          <Package className='h-3 w-3 text-blue-500' />
        )}
        <span className='truncate'>{order.customer}</span>
      </div>
    </div>
  )
}