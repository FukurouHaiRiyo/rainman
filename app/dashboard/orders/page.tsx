'use client';

import React, { useState } from 'react';
import { Calendar, Loader2, Package, Plus, Search, Truck, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseData, firebaseService } from '@/app/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

// @typescript-eslint/no-explicit-any
// @typescript-eslint/no-unused-vars
const OrdersOverview = ({ detailed = true }: { detailed?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [orderType, setOrderType] = useState('all')
  const { data: orders, loading, refreshData } = useFirebaseData('orders')
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    customer: '',
    date: '',
    items: '',
    status: '',
  });

  const resetForm = () => {
    setFormData({
      id: '',
      type: '',
      customer: '',
      date: '',
      items: '',
      status: '',
    });

    setIsEditing(false);
    setSelectedOrder(null);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setFormData({
      id: order.id,
      type: order.type,
      customer: order.customer,
      date: order.date,
      items: order.items.toString(),
      status: order.status
    });

    setIsEditing(true);
    setOpen(true);
  }

  const handleDelete = (order: any) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (!selectedOrder) return

    const result = await firebaseService.delete('orders', selectedOrder.id)

    if (result.success) {
      toast({
        title: 'Order deleted',
        description: 'The order has been deleted successfully.',
      })
      refreshData()
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete the order. Please try again.',
        variant: 'destructive',
      })
    }

    setDeleteDialogOpen(false)
    setSelectedOrder(null)
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.id || !formData.type || !formData.customer || !formData.date || !formData.items || !formData.status) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    try {
      const orderData = {
        id: formData.id,
        type: formData.type,
        customer: formData.customer,
        date: formData.date,
        items: Number.parseInt(formData.items),
        status: formData.status,
      }

      let result

      if (isEditing && selectedOrder) {
        // Update existing order
        result = await firebaseService.update('orders', selectedOrder.id, orderData)

        if (result.success) {
          toast({
            title: 'Order updated',
            description: 'The order has been updated successfully.',
          })
        }
      } else {
        // Create new order
        result = await firebaseService.create('orders', orderData)

        if (result.success) {
          toast({
            title: 'Order added',
            description: 'The order has been added successfully.',
          })
        }
      }

      if (!result.success) {
        throw new Error('Operation failed')
      }

      // Reset form and close dialog
      resetForm()
      setOpen(false)
      refreshData()
    } catch (error) {
      console.error('Error saving order:', error)
      toast({
        title: 'Error',
        description: 'Failed to save the order. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const filteredOrders =
    orders?.filter((order: any) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = orderType === 'all' || orderType === order.type

      return matchesSearch && matchesType;
    }) || [];

  const recentOrders = orders?.slice(0, 5) || [];

  if (!detailed) {
    return (
      <div className='space-y-4'>
        {loading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ): (
          <div>
            {recentOrders.length === 0 ? (
              <div className='flex flex-col items-center justify-center text-muted-foreground py-8'>
                <Package className='h-8 w-8 mb-2' />
                <p> No package order </p>
              </div>
            ): (
              <div className='space-y-2'>
                {recentOrders.map((order: any) => (
                  <div key={order.id} className='flex items-center justify-between p-2 border rounded-md'>
                    <div className='flex items-center gap-2'>
                      {order.type === 'inbound' ? (
                        <Truck className='h-4 w-4 text-green-500' />
                      ): (
                        <Package className='h-4 w-4 text-blue-500'/>
                      )}

                      <div>
                        <p className='text-sm font-medium'>{order.id}</p>
                        <p className='text-xs text-muted-foreground'>{order.customer}</p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'processing'
                              ? 'secondary'
                              : order.status === 'pending'
                                ? 'outline'
                                : 'destructive'
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>{order.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}  
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Managementul comenzilor
          </h2>

          <p className='text-sm text-muted-foreground'> 
            Procesați comenzile de intrare și de ieșire
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button>
            <Calendar className='mr-2 h-4 w-4' />
            Vezi Calendar
          </Button>

          <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen)
            if(!newOpen) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New order
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Order': 'Create new'} 
                </DialogTitle>

                <DialogDescription>
                  {isEditing ? 'Actualizați detaliile comenzii.': 'Introduceți detaliile pentru noua comandă.'}
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='id' className='text-right'>
                    ID comandă
                  </Label>
                  <Input 
                    id='id'
                    className='col-span-3'
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled={isEditing}
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='type' className='text-right'>
                    Type
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='inbound'>Inbound</SelectItem>
                      <SelectItem value='outbound'>Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='customer' className='text-right'>
                    Customer
                  </Label>
                  <Input id='customer' className='col-span-3' value={formData.customer} onChange={handleInputChange} />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>
                    Date
                  </Label>
                  <Input
                    id='date'
                    className='col-span-3'
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder='MM/DD/YYYY'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='items' className='text-right'>
                    Items
                  </Label>
                  <Input
                    id='items'
                    type='number'
                    className='col-span-3'
                    value={formData.items}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='status' className='text-right'>
                    Status
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='processing'>Processing</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant='outline' onClick={() => {
                  resetForm();
                  setOpen(false);
                }}>
                  Cancel 
                </Button>

                <Button type='submit' onClick={handleSubmit}>
                  {isEditing ? 'Actualizați comanda': 'Creați comanda'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='all' onValueChange={setOrderType} className='space-y-4'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Toate comenzile</TabsTrigger>
            <TabsTrigger value='inbound'>Comenzi de intrare</TabsTrigger>
            <TabsTrigger value='outbound'>Comenzi de ieșire</TabsTrigger>
          </TabsList>

          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input 
              type='search'
              placeholder='Caută comenzi'
              className='pl-8 w-[200px] md:w-[300px]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value='all' className='space-y-4'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value='inbound' className='space-y-4'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value='outbound' className='space-y-4'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </>
  )
}

function OrdersTable({
  orders, loading, onEdit, onDelete
}: {
  orders: any[], loading: boolean, onEdit: (order: any) => void, onDelete: (order: any) => void
}) {
  return(
    <Card>
      <CardHeader>
        <CardTitle> Comenzi </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animates-spin text-muted-foreground' />
          </div>
        ): (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> ID comandă </TableHead>
                <TableHead> Tip </TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Articole</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                      <Package className='h-8 w-8 mb-2' />
                      <p>Nu au fost găsite comenzi</p>
                    </div>
                  </TableCell>
                </TableRow>
              ): (
                orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'> {order.id} </TableCell>

                    <TableCell>
                      <Badge variant={order.type === 'inbound' ? 'outline' : 'secondary'}>
                        {order.type === 'inbound' ? 'Inbound' : 'Outbound'}
                      </Badge>
                    </TableCell>

                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'processing'
                              ? 'secondary'
                              : order.status === 'pending'
                                ? 'outline'
                                : 'destructive'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    <TableCell className='text-right'>
                      <Button variant='ghost' size='icon' onClick={() => onEdit(order)} className='mr-1'>
                        <Edit className='h-4 w-4' />
                        <span className='sr-only'>Edit</span>
                      </Button>
                      <Button variant='ghost' size='icon' onClick={() => onDelete(order)}>
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default OrdersOverview;