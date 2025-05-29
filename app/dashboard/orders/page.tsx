'use client';

import React from 'react';

import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import OrdersOverview from '@/components/orders/overview';
import { Badge } from '@/components/ui/badge';

const orders = () => {
  const { data: orders } = useFirebaseData('orders');

  // Calculate order metrics
  const pendingOrders = orders?.filter((order: any) => order.status === 'pending') || [];
  const processingOrders = orders?.filter((order: any) => order.status === 'processing') || [];
  const completedOrders = orders?.filter((order: any) => order.status === 'completed') || [];

  // Get orders that need attention (pending orders sorted by date)
  const ordersNeedingAttention = [...(pendingOrders || [])]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className='space-y-4'>
      <h2 className='text-3xl'> Tabloul de bord al comenzilor </h2>
      <p className='text-muted-foreground'> Gestionați și procesați eficient comenzile clienților. </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default orders;