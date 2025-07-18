'use client';

import React from 'react';

import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';

export default function OrderProcessorDashboard() {
  const { data: orders } = useFirebaseData('orders');

  // Calculate order metrics 
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending') || [];
  const processingOrders = orders?.filter((order: any) => order.status === 'processing') || [];
  const completedOrders = orders?.filter((order: any) => order.status === "completed") || [];

  // Get the orders that need attention (pending orders sorted by date)
  const ordersNeedingAttention = [...(pendingOrders || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);


  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold tracking-tight'>
        Tabloul de bord comenzi
      </h2>
      <p className='text-muted-foreground'> 
        Gestionați și procesați eficient comenzile clienților.
      </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total comenzi
            </CardTitle>

            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'>
              {orders?.length || 0}
            </div>
            <p className='text-xs text-muted-foreground'>
              Comenzi tot timpul
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Comenzi în așteptare
            </CardTitle>

            <Clock className='h-4 w-4 text-yellow-500' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> {pendingOrders.length} </div>
            <p className='text-xs text-muted-foreground'> În așteptarea procesării </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'> În procesare </CardTitle>
            <AlertCircle className='h-4 w-4 text-blue-500' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'> {processingOrders.length} </div>
            <p className='text-xs text-muted-foreground'> În prezent în curs de procesare </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Comenzi Complete
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'>
              {completedOrders.length}
              <p className='text-xs text-muted-foreground'>
                Comenzi îndeplinite cu succes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardHeader>
            <CardTitle>
              Comenzi care necesită atenție
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              {ordersNeedingAttention.length > 0 ? (
                ordersNeedingAttention.map((order: any, i: any) => (
                  <div key={i} className='flex items-center justify-between border-b pb-2'>
                    <div>
                      <p className='font-medium'> {order.id} </p>
                      <p className='text-sm text-muted-foreground'>
                        {order.customer}
                      </p>
                    </div>

                    
                  </div>
                ))
              ): (
                <p className='text-muted-foreground text-center py-4'>
                  Nicio comandă nu necesită atenție
                </p>
              )}
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}