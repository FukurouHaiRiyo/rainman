'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseData } from '@/app/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/context/user-context';

const EmployeeScheduler = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const { data: employees, loading } = useFirebaseData('employees');
  const { data: shifts } = useFirebaseData('shifts');
  const { toast } = useToast();

  const { role, isLoading } = useUserRole()

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }) // End on Sunday

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  const handleNextsWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startDate, i);
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
      fullDate: format(day, 'yyyy-MM-dd'),
    }
  });

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>Programat angajați</h2>
          <p className='text-sm text-muted-foreground'>Gestionați programul de lucru al angajaților</p>
        </div>

        <div className='flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            { role !== 'admin' ? (<Button>
                <Plus className='mr-2 h-4 w-4' />
                Add shift
              </Button>): null}
            </DialogTrigger>

            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle> Programați un nou schimb </DialogTitle>
                <DialogDescription> Atribuiți o tură unui angajat. </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='employee' className='text-right'>
                    Angajat
                  </Label>

                  <Select>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Selectează angajat' />
                    </SelectTrigger>

                    <SelectContent>
                      {employees?.map((employee: any) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>
                    Data
                  </Label>
                  <Input id='date' type='date' className='col-span-3' />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='shift' className='text-right'>
                    Tura
                  </Label>

                  <Select>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Selectează tură'/>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value='morning'>Dimineaţa (6:00 - 14:00)</SelectItem>
                      <SelectItem value='afternoon'>După-amiază (14:00 - 22:00)</SelectItem>
                      <SelectItem value='night'>Noaptea (22:00 - 6:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grrid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='role' className='text-right'>
                    Rol
                  </Label>

                  <Select>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Selectează rol'/>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value='picker'>Picker</SelectItem>
                      <SelectItem value='packer'>Packer</SelectItem>
                      <SelectItem value='loader'>Loader</SelectItem>
                      <SelectItem value='supervisor'>Supervizor</SelectItem>
                      <SelectItem value='driver'>Șofer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type='submit' onClick={() => {setOpen(false); toast({title: 'Schimbul a fost salvat', description: 'Schimbul angajatului a fost adăugat.'})}}>
                  Programează schimb
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='flex items-center justify-between mt-4'>
        <Button variant='outline' size='sm' onClick={handlePreviousWeek}>
          <ChevronLeft className='h-4 w-4 mr-2' />
          Săptămâna anterioară
        </Button>

        <div className='text-sm font-medium'>
          {format(startDate, 'MMMM d, yyyy')} - {format(endDate, 'MMMM d, yyyy')}
        </div>

        <Button variant='outline' size='sm' onClick={handleNextsWeek}>
          <ChevronRight className='h-4 w-4 mr-2' />
          Săptămâna viitoare
        </Button>
      </div>

      <Card className='mt-4'>
        <CardHeader>
          Program săptămânal
        </CardHeader>

        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th className='border p-2 bg-muted text-left'> Angajat </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className='border p-2 bg-muted text-center'>
                      <div>{day.dayName}</div>
                      <div>{day.dayNumber}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {employees?.map((employee: any) => (
                  <tr key={employee.id}>
                    <td className='border p-2'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4' />

                        <div>
                          <div className='font-medium'>{employee.name}</div>
                          <div className='text-xs text-muted-foreground'>{employee.role}</div>
                        </div>
                      </div>
                    </td>

                    {weekDays.map((day, dayIndex) => {
                      const employeeShifts= shifts.filter(
                        (shift:any) => shift.employeeId === employee.id && shift.date === day.fullDate
                      )

                      return (
                        <td key={dayIndex} className="border p-2 text-center">
                          {employeeShifts && employeeShifts.length > 0 ? (
                            <div className="space-y-1">
                              {employeeShifts.map((shift: any, shiftIndex: any) => (
                                <Badge
                                  key={shiftIndex}
                                  variant={
                                    shift.shift === "morning"
                                      ? "default"
                                      : shift.shift === "afternoon"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="w-full justify-center"
                                >
                                  {shift.shift === "morning"
                                    ? "Morning"
                                    : shift.shift === "afternoon"
                                      ? "Afternoon"
                                      : "Night"}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">Off</div>
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

export default EmployeeScheduler;