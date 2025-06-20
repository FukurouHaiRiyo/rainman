'use client';

import React, { useState } from 'react';
import {
  Loader2,
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  CalendarIcon,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { format } from 'date-fns';

const OrdersOverview = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('all');
  const { data: orders, loading, refreshData } = useFirebaseData('orders');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: '',
    type: '',
    customer: '',
    date: undefined as Date | undefined,
    items: '',
    status: '',
  });

  const resetForm = () => {
    setFormData({
      id: '',
      type: '',
      customer: '',
      date: undefined,
      items: '',
      status: '',
    });
    setIsEditing(false);
    setSelectedOrder(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setFormData({
      id: order.id,
      type: order.type,
      customer: order.customer,
      date: new Date(order.date),
      items: order.items.toString(),
      status: order.status,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (order: any) => {
    const result = await firebaseService.delete('orders', order.id);
    if (result.success) {
      toast({ title: 'Order deleted', description: 'The order has been deleted.' });
      refreshData();
    } else {
      toast({ title: 'Error', description: 'Failed to delete the order.', variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.id || !formData.type || !formData.customer || !formData.date || !formData.items || !formData.status) {
      toast({ title: 'Missing info', description: 'Fill all fields.', variant: 'destructive' });
      return;
    }

    const orderData = {
      id: formData.id,
      type: formData.type,
      customer: formData.customer,
      date: formData.date.toISOString(),
      items: parseInt(formData.items),
      status: formData.status,
    };

    let result;
    if (isEditing && selectedOrder) {
      result = await firebaseService.update('orders', selectedOrder.id, orderData);
    } else {
      result = await firebaseService.create('orders', orderData);
    }

    if (result.success) {
      toast({ title: 'Success', description: 'Order saved.' });
      resetForm();
      setOpen(false);
      refreshData();
    } else {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    }
  };

  const filteredOrders =
    orders?.filter((order: any) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = orderType === 'all' || orderType === order.type;
      return matchesSearch && matchesType;
    }) || [];

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Managementul comenzilor</h2>
          <p className='text-sm text-muted-foreground'>Procesează comenzile de intrare și de ieșire</p>
        </div>

        <div className='flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New order
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[500px] radix-dialog-content'>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Order' : 'Create Order'}</DialogTitle>
                <DialogDescription>Completează detaliile comenzii.</DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='id' className='text-right'>ID</Label>
                  <Input id='id' className='col-span-3' value={formData.id} onChange={handleInputChange} disabled={isEditing} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='type' className='text-right'>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
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
                  <Label htmlFor='customer' className='text-right'>Client</Label>
                  <Input id='customer' className='col-span-3' value={formData.customer} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='outline' className='w-full col-span-3 justify-start text-left'>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {formData.date ? format(formData.date, 'dd/MM/yyyy') : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side='bottom' align='start' className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={formData.date}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
                        className='radix-dialog-content'
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='items' className='text-right'>Items</Label>
                  <Input id='items' type='number' className='col-span-3' value={formData.items} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='status' className='text-right radix-dialog-content'>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent className='radix-dialog-content'>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='processing'>Processing</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Save'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='all' onValueChange={setOrderType} className='space-y-4'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Toate</TabsTrigger>
            <TabsTrigger value='inbound'>Intrare</TabsTrigger>
            <TabsTrigger value='outbound'>Ieșire</TabsTrigger>
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

        <TabsContent value='all'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value='inbound'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value='outbound'>
          <OrdersTable orders={filteredOrders} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </>
  );
};

function OrdersTable({
  orders,
  loading,
  onEdit,
  onDelete,
}: {
  orders: any[];
  loading: boolean;
  onEdit: (order: any) => void;
  onDelete: (order: any) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comenzi</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tip</TableHead>
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
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Badge variant={order.type === 'inbound' ? 'outline' : 'secondary'}>
                        {order.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{format(new Date(order.date), 'dd/MM/yyyy')}</TableCell>
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
                      </Button>
                      <Button variant='ghost' size='icon' onClick={() => onDelete(order)}>
                        <Trash2 className='h-4 w-4' />
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
