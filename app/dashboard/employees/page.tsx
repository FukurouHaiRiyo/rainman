'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirebaseData, firebaseService } from '@/app/lib/firebase';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function EmployeeScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ userId: '', date: '', shift: '', role: '' });
  const { toast } = useToast();

  const { data: employees } = useFirebaseData('employees');
  const { data: shifts, refreshData } = useFirebaseData('shifts');

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startDate, i);

    return {
      fullDate: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
    }
  });

  const handleSubmit = async () => {
    if (!formData.userId || !formData.date || !formData.shift || !formData.role) {
      toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }

    const result = await firebaseService.create('shifts', formData);

    if (result.success) {
      toast({ title: 'Schimb programat', description: 'Tura pentru angajat a fost adăugată.' })
      refreshData()
      setOpen(false)
      setFormData({ userId: '', date: '', shift: '', role: '' })
    } else {
      toast({ title: 'Error', description: 'Nu s-a putut programa tura.', variant: 'destructive' })
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Programat de angajați
          </h2>

          <p className='text-sm text-muted-foreground'>
            Gestionați programul de lucru al angajaților
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Adăugați tură
            </Button>
          </DialogTrigger>

          <DialogContent className='radix-dialog-content'>
            <DialogHeader>
              <DialogTitle>
                Programați un nou schimb
              </DialogTitle>

              <DialogDescription>
                Atribuiți o tură unui angajat.
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'> 
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label> Angajat </Label>
                <Select value={formData.userId} onValueChange={(v) => setFormData({ ...formData, userId: v })}>
                  <SelectTrigger className='col-span-3'><SelectValue placeholder='Select employee' /></SelectTrigger>
                  <SelectContent>
                    {employees?.map((emp: any) => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label>Data</Label>
                <Input type='date' className='col-span-3' value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label>Tura</Label>
                <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                  <SelectTrigger className='col-span-3'><SelectValue placeholder='Select shift' /></SelectTrigger>
                  <SelectContent className='radix-dialog-content'>
                    <SelectItem value='morning'>Morning (6–14)</SelectItem>
                    <SelectItem value='afternoon'>Afternoon (14–22)</SelectItem>
                    <SelectItem value='night'>Night (22–6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label>Rol</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger className='col-span-3'><SelectValue placeholder='Select role' /></SelectTrigger>
                  <SelectContent className='radix-dialog-content'>
                    <SelectItem value='picker'>Picker</SelectItem>
                    <SelectItem value='packer'>Packer</SelectItem>
                    <SelectItem value='loader'>Loader</SelectItem>
                    <SelectItem value='supervisor'>Supervisor</SelectItem>
                    <SelectItem value='driver'>Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit}> Program de schimb </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <Button variant='outline' onClick={() => setCurrentDate(addDays(currentDate, -7))}>
          <ChevronLeft className='h-4 w-4 mr-2' /> Săptămâna anterioară
        </Button>
        <div className='text-sm font-medium'>
          {format(startDate, 'MMMM d, yyyy')} – {format(endDate, 'MMMM d, yyyy')}
        </div>
        <Button variant='outline' onClick={() => setCurrentDate(addDays(currentDate, 7))}>
          Săptămâna viitoare <ChevronRight className='h-4 w-4 ml-2' />
        </Button>
      </div>

      <Card className='mt-4'>
        <CardHeader> 
          <CardTitle>
            Program săptămânal
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th className='border p-2 bg-muted text-left'>
                    Angajat
                  </th>

                  {weekDays.map((day, i) => (
                    <th key={i} className='border p-2 bg-muted text-center'>
                      <div>{day.dayName}</div>
                      <div>{day.dayNumber}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {employees?.map((emp: any) => (
                  <tr key={emp.id}>
                    <td className='border p-2'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        <div>
                          <div className='font-medium'>{emp.name}</div>
                          <div className='text-xs text-muted-foreground'>{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day, dayIndex) => {
                      const employeeShifts = shifts?.filter(
                        (s: any) => s.userId === emp.id && s.date === day.fullDate
                      )
                      return (
                        <td key={dayIndex} className='border p-2 text-center'>
                          {employeeShifts?.length ? (
                            employeeShifts.map((s: any, i: number) => (
                              <Badge
                                key={i}
                                variant={
                                  s.shift === 'morning'
                                    ? 'default'
                                    : s.shift === 'afternoon'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className='w-full justify-center'
                              >
                                {s.shift.charAt(0).toUpperCase() + s.shift.slice(1)}
                              </Badge>
                            ))
                          ) : (
                            <div className='text-xs text-muted-foreground'>Off</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
