'use client';

import React, { useState } from 'react';
import { Calendar, Clock, DoorOpen, Loader2, Search, Truck, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; 
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { useFirebaseData } from '@/app/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { firebaseService } from '@/app/lib/firebase';
import { generateDriverPaperwork } from '@/app/lib/documentGeneration';
import { useUserRole } from '@/context/user-context';

const DriverDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('all');
  const { data: drivers, loading, refreshData } = useFirebaseData('drivers');
  const { data: doorActivity } = useFirebaseData('doorActivity');
  const { data: scheduledOrders } = useFirebaseData('scheduledOrders');
  const [open, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { role } = useUserRole();

  // Form
  const [formData, setFormData] = useState({ name: '', truckId: '', company: '', orderType: '', orderId: '', notes: '' });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  const handleSelectChange = (id: string, value: string) => setFormData((prev) => ({ ...prev, [id]: value }));

  const today = new Date().toISOString().split('T')[0];

  const checkedInDrivers = drivers?.filter((d: any) => d.status === 'checked-in') || [];
  const loadingDrivers = drivers?.filter((d: any) => d.status === 'loading') || [];
  const waitingDrivers = drivers?.filter((d: any) => d.status === 'waiting') || [];

  const activeDoors = doorActivity?.filter((d: any) => d.isLatest && d.type === 'open') || [];
  const todaysScheduledOrders = scheduledOrders?.filter((o: any) => new Date(o.scheduledDate).toISOString().split('T')[0] === today) || [];

  const filteredDrivers = drivers?.filter((driver: any) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase())
      || driver.truckId.toLowerCase().includes(searchQuery.toLowerCase())
      || driver.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = checkInStatus === 'all' || checkInStatus === driver.status;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSubmit = async () => {
    if (!formData.name || !formData.truckId || !formData.company || !formData.orderType || !formData.orderId) {
      toast({ title: 'Informații lipsă', description: 'Completați toate câmpurile obligatorii.', variant: 'destructive' });
      return;
    }

    const result = await firebaseService.create('drivers', {
      ...formData,
      status: 'checked-in',
      checkInTime: new Date().toLocaleTimeString(),
    });

    if (result.success) {
      toast({ title: 'Șofer înregistrat', description: 'Check-in realizat cu succes.' });
      setFormData({ name: '', truckId: '', company: '', orderType: '', orderId: '', notes: '' });
      setIsOpen(false);
      refreshData();
    } else {
      toast({ title: 'Eroare', description: 'Nu s-a putut realiza check-in.', variant: 'destructive' });
    }
  };

  const handleCheckIn = async (id: string) => {
    const driver = drivers?.find((d: any) => d.id === id);
    if (!driver) return;

    const result = await firebaseService.update('drivers', id, {
      ...driver,
      status: 'checked-in',
      checkInTime: new Date().toLocaleTimeString(),
    });

    if (result.success) {
      toast({ title: 'Check-in', description: 'Șoferul a fost înregistrat.' });
      refreshData();
    }
  };

  const handleCheckOut = async (id: string) => {
    const driver = drivers?.find((d: any) => d.id === id);
    if (!driver) return;

    const result = await firebaseService.update('drivers', id, {
      ...driver,
      status: 'checked-out',
      checkedOutTime: new Date().toLocaleTimeString(),
    });

    if (result.success) {
      toast({ title: 'Check-out', description: 'Șoferul a fost procesat.' });
      refreshData();
    }
  };

  const handleGenerateDocument = async (id: string) => {
    const driver = drivers?.find((d: any) => d.id === id);
    if (!driver) return;

    const blob = await generateDriverPaperwork(driver);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `driver-paperwork-${driver.name}-${driver.orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='space-y-6'>
      {/* HEADER + CHECK-IN */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold'>Tabloul de bord pentru șoferi</h2>
          <p className='text-muted-foreground'>Monitorizare activitate + check-in șoferi.</p>
        </div>

        {role !== 'admin' && (
          <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className='mr-2 h-4 w-4' />
                Check-in șofer
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Check-In</DialogTitle>
                <DialogDescription>Introduceți detalii despre șofer.</DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                {['name', 'truckId', 'company', 'orderId'].map((field) => (
                  <div key={field} className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor={field} className='text-right'>{field}</Label>
                    <Input id={field} className='col-span-3' value={formData[field as keyof typeof formData]} onChange={handleInputChange} />
                  </div>
                ))}

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label className='text-right'>Tip Comandă</Label>
                  <Select onValueChange={(val: any) => handleSelectChange('orderType', val)}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Selectează' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='inbound'>Inbound</SelectItem>
                      <SelectItem value='outbound'>Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='notes' className='text-right'>Note</Label>
                  <Textarea id='notes' className='col-span-3' value={formData.notes} onChange={handleInputChange} />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>Check-in</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* DASHBOARD METRICS */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard title='Șoferi activi' icon={<Truck />} value={checkedInDrivers.length + loadingDrivers.length} sub={`${waitingDrivers.length} în așteptare`} />
        <DashboardCard title='Docuri active' icon={<DoorOpen />} value={`${activeDoors.length} / 6`} sub='Docuri în uz' />
        <DashboardCard title='Programul de azi' icon={<Calendar />} value={todaysScheduledOrders.length} sub='Livrări & ridicări' />
        <DashboardCard title='Timp mediu de așteptare' icon={<Clock />} value='24 min' sub='Procesare șofer' />
      </div>

      {/* TABS + TABLE */}
      <Tabs defaultValue='all' onValueChange={setCheckInStatus} className='space-y-4'>
        <div className='flex justify-between items-center'>
          <TabsList>
            <TabsTrigger value='all'>Toți</TabsTrigger>
            <TabsTrigger value='checked-in'>Checked-in</TabsTrigger>
            <TabsTrigger value='checked-out'>Checked-out</TabsTrigger>
            <TabsTrigger value='loading'>Loading</TabsTrigger>
            <TabsTrigger value='waiting'>Așteptare</TabsTrigger>
          </TabsList>

          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input placeholder='Căutare șofer' className='pl-8 w-[250px]' value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <TabsContent value={checkInStatus}>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Reusable UI components

const DashboardCard = ({ title, icon, value, sub }: { title: string; icon: React.ReactNode; value: string | number; sub: string }) => (
  <Card>
    <CardHeader className='flex flex-row justify-between items-center pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      <span className='text-muted-foreground'>{icon}</span>
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-bold'>{value}</div>
      <p className='text-xs text-muted-foreground'>{sub}</p>
    </CardContent>
  </Card>
);

const DriversTable = ({ drivers, loading, onCheckIn, onCheckOut, onGenerateDocument }: {
  drivers: any[], loading: boolean, onCheckIn: (id: string) => void, onCheckOut: (id: string) => void, onGenerateDocument: (id: string) => void
}) => (
  <Card>
    <CardHeader><CardTitle>Activitate șoferi</CardTitle></CardHeader>
    <CardContent>
      {loading ? (
        <div className='flex justify-center p-6'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead><TableHead>Camion</TableHead><TableHead>Companie</TableHead>
              <TableHead>Tip</TableHead><TableHead>ID</TableHead><TableHead>Check-in</TableHead>
              <TableHead>Status</TableHead><TableHead className='text-right'>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center text-muted-foreground py-6'>
                  <Truck className='mx-auto mb-2' />
                  Niciun șofer înregistrat
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.truckId}</TableCell>
                  <TableCell>{d.company}</TableCell>
                  <TableCell><Badge variant={d.orderType === 'inbound' ? 'outline' : 'secondary'}>{d.orderType}</Badge></TableCell>
                  <TableCell>{d.orderId}</TableCell>
                  <TableCell>{d.checkInTime}</TableCell>
                  <TableCell>
                    <Badge variant={
                      d.status === 'checked-in' ? 'default' :
                        d.status === 'loading' ? 'secondary' :
                          d.status === 'waiting' ? 'outline' : 'destructive'
                    }>
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right space-x-2'>
                    {d.status === 'checked-out' ? (
                      <Button size='sm' variant='outline' onClick={() => onCheckIn(d.id)}>Check In</Button>
                    ) : (
                      <>
                        <Button size='sm' variant='outline' onClick={() => onCheckOut(d.id)}>Check Out</Button>
                        <Button size='sm' variant='outline' onClick={() => onGenerateDocument(d.id)}>PDF</Button>
                      </>
                    )}
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

export default DriverDashboard;
