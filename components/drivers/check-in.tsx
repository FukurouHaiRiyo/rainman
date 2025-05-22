'use client';

import React, { useState } from 'react';
import { Clock, Loader2, Search, Truck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseData } from '@/app/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { firebaseService } from '@/app/lib/firebase';
import { generateDriverPaperwork } from '@/app/lib/documentGeneration';

const DriverCheckIn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('all');
  const { data: drivers, loading, refreshData } = useFirebaseData('drivers');
  const [open, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    truckId: '',
    company: '',
    orderType: '',
    orderId: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const filteredDrivers =
    drivers?.filter((driver: any) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.truckId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.company.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = checkInStatus === 'all' || checkInStatus === driver.status

      return matchesSearch && matchesStatus
    }) || [];

  // Update the handleCheckIn function to use the refreshData method
  const handleCheckIn = async (driverId: string) => {
    try {
      // Find the driver 
      const driver = drivers?.find((d: any) => d.id === driverId);

      if (!driver)
        return;

      // Update driver status
      const result = await firebaseService.update('drivers', driverId, {
        ...driver,
        status: 'checked-in',
        checkInTime: new Date().toLocaleDateString(),
      });

      if (result.success) {
        toast({
          title: 'Check in',
          description: 'Check in realizat cu succes'
        });

        refreshData();
      } else {
        toast({
          title: 'Eroare',
          description: 'Nu s-a putut face check in șoferului. Vă rugăm să încercați din nou.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error checking in driver:');
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut face check in șoferului. Vă rugăm să încercați din nou.',
        variant: 'destructive'
      });
    }
  }

  // Update the handleCheckOut function to use the refreshData method
  const handleCheckOut = async (driverId: string) => {
    try {
      // Find the driver
      const driver = drivers?.find((d: any) => d.id === driverId);

      if (!driver)
        return;

      // Update driver status 
      const result = await firebaseService.update('drivers', driverId, {
        ...driver,
        status: 'checked-out',
        checkedOutTime: new Date().toLocaleTimeString()
      });

      if (result.success) {
        toast({
          title: 'Check out',
          description: 'Check out realizat cu succes'
        });

        refreshData();
      } else {
        toast({
          title: 'Eroare',
          description: 'Nu s-a putut face check out șoferului. Vă rugăm să încercați din nou.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error checking out driver: ', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut face check out șoferului. Vă rugăm să încercați din nou.',
        variant: 'destructive'
      });
    }
  }

  const handleGenerateDocument = async (driverId: string) => {
    try {
      // Find the driver
      const driver = drivers?.find((d: any) => d.id === driverId);

      if (!driver)
        return;

      toast({
        title: 'Generare document',
        description: 'Se generează documentele șoferului.'
      });

      // Generate pdf
      const pdfBlob = await generateDriverPaperwork(driver);

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `driver-paperwork-${driver.name}-${driver.orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Document generat',
        description: 'Documentele șoferului au fost generate și descărcate.'
      });
    } catch (error) {
      console.error('Error generating document: ', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut genera documentul. Vă rugăm să încercați din nou.',
        variant: 'destructive'
      });
    }
  }

  // Update the handleSubmit function to use the refreshData method
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.truckId || !formData.company || !formData.orderType || !formData.orderId) {
        toast({
          title: 'Informații lipsă',
          description: 'Vă rugăm să completați toate câmpurile obligatorii.',
          variant: 'destructive'
        });

        return;
      }

      // Create new driver check-in
      const result = await firebaseService.create('drivers', {
        name: formData.name,
        truckId: formData.truckId,
        company: formData.company,
        orderType: formData.orderType,
        orderId: formData.orderId,
        notes: formData.notes,
        status: 'checked-in',
        checkInTime: new Date().toLocaleTimeString(),
      });

      if (result.success) {
        // Reset form and close dialog
        setFormData({
          name: '',
          truckId: '',
          company: '',
          orderType: '',
          orderId: '',
          notes: '',
        })
        setIsOpen(false);
        refreshData();

        toast({
          title: 'Checked in',
          description: 'Șoferul a fost înregistrat cu succes.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Nu s-a putut realiza check-in pentru șofer. Vă rugăm să încercați din nou.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error checking in driver: ', error);
      toast({
        title: 'Error',
        description: 'Nu s-a putut realiza check-in pentru șofer. Vă rugăm să încercați din nou.',
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Check-in șofer
          </h2>

          <p className='text-sm text-muted-foreground'>
            Gestionați sosirile și plecările șoferilor
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserCheck className='mr-2 h-4 w-4' />
                Înregistrare șofer
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Driver Check-In</DialogTitle>
                <DialogDescription>Introduceți detaliile șoferului și detaliile expedierii.</DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Numele șoferului
                  </Label>
                  <Input id='name' className='col-span-3' value={formData.name} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='truckId' className='text-right'>
                    ID Camion
                  </Label>
                  <Input id='truckId' className='col-span-3' value={formData.truckId} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='company' className='text-right'>
                    Companie
                  </Label>
                  <Input id='company' className='col-span-3' value={formData.company} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='orderType' className='text-right'>
                    Tip comandă
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('orderType', value)}>
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
                    ID comandă
                  </Label>
                  <Input id='orderId' className='col-span-3' value={formData.orderId} onChange={handleInputChange} />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='notes' className='text-right'>
                    Note
                  </Label>
                  <Textarea id='notes' className='col-span-3' value={formData.notes} onChange={handleInputChange} />
                </div>
              </div>

              <DialogFooter>
                <Button type='submit' onClick={handleSubmit}>
                  Check-in
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='all' onValueChange={setCheckInStatus} className='space-y-4'>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='all'>Toți șoferii</TabsTrigger>
            <TabsTrigger value='checked-in'>Checked In</TabsTrigger>
            <TabsTrigger value='checked-out'>Checked Out</TabsTrigger>
            <TabsTrigger value='loading'>Încărcare</TabsTrigger>
            <TabsTrigger value='waiting'>Aşteptare</TabsTrigger>
          </TabsList>

          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Căutare'
              className='pl-8 w-[200px] md:w-[300px]'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value='all' className='space-y-4'>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>

        <TabsContent value='checked-in' className='space-y-4'>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>

        <TabsContent value='checked-out' className='space-y-4'>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>

        <TabsContent value='loading' className='space-y-4'>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>

        <TabsContent value='waiting' className='space-y-4'>
          <DriversTable
            drivers={filteredDrivers}
            loading={loading}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onGenerateDocument={handleGenerateDocument}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

function DriversTable({
  drivers, loading, onCheckIn, onCheckOut, onGenerateDocument
}: {
  drivers: any[]
  loading: boolean
  onCheckIn: (id: string) => void
  onCheckOut: (id: string) => void
  onGenerateDocument: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Activitatea șoferilor
        </CardTitle>
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
                <TableHead> Numele șoferului </TableHead>
                <TableHead> ID camion </TableHead>
                <TableHead>Companie </TableHead>
                <TableHead> Tipul comenzii </TableHead>
                <TableHead> ID comanda </TableHead>
                <TableHead> Check-in </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Acțiuni</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {drivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-8'>
                    <div className='flex flex-col items-center justify-center text-muted-foreground'>
                      <Truck className='h-8 w-8 mb-2' />
                      <p>Nu au fost găsiți șoferi</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className='font-medium'>{driver.name}</TableCell>
                    <TableCell>{driver.truckId}</TableCell>
                    <TableCell>{driver.company}</TableCell>
                    <TableCell>
                      <Badge variant={driver.orderType === 'inbound' ? 'outline' : 'secondary'}>
                        {driver.orderType === 'inbound' ? 'Inbound' : 'Outbound'}
                      </Badge>
                    </TableCell>
                    <TableCell>{driver.orderId}</TableCell>
                    <TableCell>{driver.checkInTime}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          driver.status === 'checked-in'
                            ? 'default'
                            : driver.status === 'loading'
                              ? 'secondary'
                              : driver.status === 'waiting'
                                ? 'outline'
                                : 'destructive'
                        }
                      >
                        {driver.status === 'checked-in'
                          ? 'Checked In'
                          : driver.status === 'checked-out'
                            ? 'Checked Out'
                            : driver.status === 'loading'
                              ? 'Loading'
                              : 'Waiting'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      {driver.status === 'checked-out' ? (
                        <Button variant='outline' size='sm' onClick={() => onCheckIn(driver.id)}>
                          <UserCheck className='mr-2 h-4 w-4' />
                          Check In
                        </Button>
                      ) : (
                        <>
                          <Button variant='outline' size='sm' onClick={() => onCheckOut(driver.id)} className='mr-2'>
                            <Clock className='mr-2 h-4 w-4' />
                            Check Out
                          </Button>
                          <Button variant='outline' size='sm' onClick={() => onGenerateDocument(driver.id)}>
                            Generare documente
                          </Button>
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
  )
}

export default DriverCheckIn;