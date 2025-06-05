'use client';

import React, { useState } from 'react';

import { AlertTriangle, Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirebaseData } from '@/app/lib/firebase';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { firebaseService } from '@/app/lib/firebaseService';

const IncidentReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Update the destructuring data to include refresh data
  const { data: incidents, loading, refreshData } = useFirebaseData('incidents');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Add state for editing and selected incident
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [deletedDialogOpen, setDeleteDialogOpen] = useState(false);

  // Add form State
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    severity: '',
    location: '',
    date: '',
    reportedBy: '',
    description: '',
    actions: '',
    status: 'reported',
  });

  // Add reset form function
  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      severity: '',
      location: '',
      date: '',
      reportedBy: '',
      description: '',
      actions: '',
      status: 'reported',
    });
    setIsEditing(false);
    setSelectedIncident(null);
  }

  // Add handle input change function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  // Add handle select change function
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Add handle edit function
  const handleEdit = (incident: any) => {
    setSelectedIncident(incident)
    setFormData({
      title: incident.title,
      type: incident.type,
      severity: incident.severity,
      location: incident.location,
      date: incident.date,
      reportedBy: incident.reportedBy,
      description: incident.description || '',
      actions: incident.actions || '',
      status: incident.status,
    });
    setIsEditing(true);
    setOpen(true);
  }

  // Add handle delete function
  const handleDelete = (incident: any) => {
    setSelectedIncident(incident);
    setDeleteDialogOpen(true);
  }

  // Add confirm delete function
  const confirmDelete = async () => {
    if (!selectedIncident) return;

    const result = await firebaseService.delete('incidents', selectedIncident.id);

    if (result.success) {
      toast({
        title: 'Incidentul a fost șters',
        description: 'Raportul incidentului a fost șters cu succes.',
      });
      refreshData();
    } else {
      toast({
        title: 'Error',
        description: 'Incidentul nu a putut fi șters. Vă rugăm să încercați din nou.',
        variant: 'destructive',
      });
    }

    setDeleteDialogOpen(false);
    setSelectedIncident(null);
  }

  // Update submit functio
  const handleSubmit = async () => {
    // Validate form
    if (!formData.title || !formData.type || !formData.severity || !formData.location || !formData.reportedBy) {
      toast({
        title: 'Informații lipsă',
        description: 'Vă rugăm să completați toate câmpurile obligatorii.',
        variant: 'destructive'
      });

      return;
    }

    try{
      const incidentData = {
        title: formData.title,
        type: formData.type,
        severity: formData.severity,
        location: formData.location,
        date: formData.date || new Date().toLocaleDateString(),
        reportedBy: formData.reportedBy,
        description: formData.description,
        actions: formData.actions,
        status: formData.status,
      }

      let result;

      if(isEditing && selectedIncident) {
        // Update existing incident
        result = await firebaseService.update('incidents', selectedIncident.id, incidentData);

        if (result.success) {
          toast({
            title: 'Incident actualizat',
            description: 'Raportul incidentului a fost actualizat cu succes.',
          });
        }
      } else {
        // create new incident
        result = await firebaseService.create('incidents', incidentData);

        if (result.success) {
          toast({
            title: 'Incident raportat',
            description: 'Raportul dumneavoastră de incident a fost trimis cu succes.'
          });
        }
      }

      if(!result.success) {
        throw new Error('Operation failed');
      }

      // Reset form and close dialog
      resetForm();
      setOpen(false);
      refreshData();
    } catch(error) {
      console.error('Error saving incident:', error);
      toast({
        title: 'Error',
        description: 'Nu s-a putut salva raportul incidentului. Vă rugăm să încercați din nou.',
        variant: 'destructive',
      });
    }
  }

  const filteredIncidents =
    incidents?.filter(
      (incident: any) =>
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <>
      <div className='flex items-center jutify-between'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Rapoarte de incidente
          </h2>

          <p className='text-sm text-muted-foreground'>
            Urmăriți și gestionați incidentele din depozit
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Raportați incidentul
              </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-[600px]'>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Editați raportul de incident': 'Raportați un nou incident'}</DialogTitle>

                <DialogDescription>
                  {isEditing
                    ? 'Actualizați detaliile incidentului.'
                    : 'Completați detaliile incidentului care a avut loc.'}
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='title' className='text-right'>
                    Titlul incidentului
                  </Label>
                  <Input 
                    id='title'
                    className='col-span-3'
                    placeholder='Scurtă descriere a incidentului'
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='type' className='text-right'>
                    Tipul incidentului
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select incident type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='safety'>Pericol de siguranță</SelectItem>
                      <SelectItem value='equipment'>Defecțiun echipament</SelectItem>
                      <SelectItem value='security'>Încălcarea securității</SelectItem>
                      <SelectItem value='damage'>Deteriorarea produsului</SelectItem>
                      <SelectItem value='other'>Altceva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='severity' className='text-right'>
                    Severitate
                  </Label>

                  <Select onValueChange={(value) => handleSelectChange('severity', value)} value={formData.severity}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select severity level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='low'>Scăzut</SelectItem>
                      <SelectItem value='medium'>Mediu</SelectItem>
                      <SelectItem value='high'>Ridicat</SelectItem>
                      <SelectItem value='critical'>Critic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='location' className='text-right'>
                    Locaţie
                  </Label>
                  <Input
                    id='location'
                    className='col-span-3'
                    placeholder='Unde s-a produs incidentul'
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='date' className='text-right'>
                    Data și ora
                  </Label>
                  <Input
                    id='date'
                    type='datetime-local'
                    className='col-span-3'
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='reportedBy' className='text-right'>
                    Raportat de
                  </Label>
                  <Input
                    id='reportedBy'
                    className='col-span-3'
                    placeholder='Your name'
                    value={formData.reportedBy}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-4 items-start gap-4'>
                  <Label htmlFor='description' className='text-right pt-2'>
                    Descriere
                  </Label>
                  <Textarea
                    id='description'
                    className='col-span-3'
                    placeholder='Detailed description of what happened'
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='grid grid-cols-4 items-start gap-4'>
                  <Label htmlFor='actions' className='text-right pt-2'>
                    Acțiuni întreprinse
                  </Label>
                  <Textarea
                    id='actions'
                    className='col-span-3'
                    placeholder='What immediate actions were taken'
                    rows={3}
                    value={formData.actions}
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
                      <SelectItem value='reported'>Raportat</SelectItem>
                      <SelectItem value='investigating'>In curs de investigare </SelectItem>
                      <SelectItem value='resolved'>Rezolvat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant='outline' onClick={() => {resetForm(); setOpen(false);}}>
                  Cancel
                </Button>

                <Button type='submit' onClick={handleSubmit}>
                  {isEditing ? 'Actualizare raport' : 'Trimiteți raportul'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='relative mt-4'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input type='search' placeholder='Caută incidente...' className='pl-8 w-full md:w-1/3 lg:w-1.4' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>Jurnalul de incidente</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ):(
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titlu</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Severitate</TableHead>
                  <TableHead>Locaţie</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Raportat de</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-8'>
                      <div className='flex flex-col items-center justify-center text-muted-foreground'>
                        <AlertTriangle className='h-8 w-8 mb-2' />
                        <p> Nu au fost găsite incidente </p>

                        {searchQuery && <p className='text-sm'> Încercați să ajustați interogarea de căutare </p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ): (
                  filteredIncidents.map((incident: any) => (
                    <TableRow key={incident.id}>
                      <TableCell className='font-medium'>
                        {incident.title}
                      </TableCell>
                      
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default IncidentReport;