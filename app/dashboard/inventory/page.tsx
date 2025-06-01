'use client';

import React from 'react';
import { Layers, AlertTriangle, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFirebaseData } from '@/app/lib/firebase'
import { Badge } from '@/components/ui/badge'

export default function InventoryDashboard() {
  const { data: inventory } = useFirebaseData('inventory');

  // calculate inventory metrics
  // @typescript-eslint/no-explicit-any
  type InventoryItem = { status: string; [key: string]: any };

  const lowStockItems = inventory?.filter((item: InventoryItem) => item.status === 'low-stock') || [];
  const outOfStockItems = inventory?.filter((item: InventoryItem) => item.status === 'out-of-stock') || [];
  const inStockItems = inventory?.filter((item: InventoryItem) => item.status === 'in-stock') || [];

  // Get top inventory items by quantity
  const topInventoryItems = [...(inventory || [])].sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  // Get low stock items that need attention
  const lowStockItemsToReorder = lowStockItems.slice(0, 5)


  return (
    <div className='space-y-4'>
      <h2 className='text-3xl font-bold tracking-light'> Panou de control </h2>

      <p className='text-muted-foreground'> Monitorizați nivelul stocurilor și gestionați stocurile. </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Inventory Items</CardTitle>

            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold'>{inventory?.length || 0}</div>
            <p className='text-xs text-muted-foreground'>Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>In Stock Items</CardTitle>
            <ArrowUpIcon className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{inStockItems.length}</div>
            <p className='text-xs text-muted-foreground'>
              {Math.round((inStockItems.length / (inventory?.length || 1)) * 100)}% of total inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Low Stock Items</CardTitle>
            <AlertTriangle className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{lowStockItems.length}</div>
            <p className='text-xs text-muted-foreground'>Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Out of Stock</CardTitle>
            <ArrowDownIcon className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{outOfStockItems.length}</div>
            <p className='text-xs text-muted-foreground'>Needs immediate reordering</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Top Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topInventoryItems.map((item, i) => (
                <div key={i} className='flex items-center justify-between border-b pb-2'>
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-muted-foreground'>{item.sku}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>{item.quantity} units</p>
                    <p className='text-sm text-muted-foreground'>{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items to Reorder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {lowStockItemsToReorder.length > 0 ? (
                // @typescript-eslint/no-explicit-any
                lowStockItemsToReorder.map((item: any, i: any) => (
                  <div key={i} className='flex items-center justify-between border-b pb-2'>
                    <div>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-muted-foreground'>{item.sku}</p>
                    </div>
                    <div className='text-right'>
                      <Badge variant={item.status === 'low-stock' ? 'outline' : 'destructive'}>
                        {item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                      <p className='text-sm text-muted-foreground mt-1'>{item.quantity} remaining</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground text-center py-4'>No items to reorder</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
