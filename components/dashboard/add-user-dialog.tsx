import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';

interface AddUserDialogProps {
  onUserAdded: () => void;
}

const AddUserDialog = ({ onUserAdded }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'guest',
    sendInvitation: true,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try{
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Succes',
        description: data.invitationSent ? 'Utilizator creat și invitația trimisă cu succes' : 'Utilizator creat'
      });

      // Reset form data and close dialog
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'guest',
        sendInvitation: true,
      });

      setOpen(false);
      onUserAdded();
      // @typescript-eslint/no-explicit-any
    } catch(error: any) {
      console.log('Error creating user: ', error);
      toast({
        title: 'Eroare',
        description: error.message || 'Nu s-a putut crea utilizatorul',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }  

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add user
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle> Adaugă utilizator nou </DialogTitle>
          <DialogDescription> Creați un nou cont de utilizator. Dacă opțiunea este activată, va fi trimis un e-mail de invitație. </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input 
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className='col-span-3'
                required
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='firstName' className='text-right'>
                Prenume
              </Label>
              <Input
                id='firstName'
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className='col-span-3'
                required
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='lastName' className='text-right'>
                Nume
              </Label>
              <Input
                id='lastName'
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className='col-span-3'
                required
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Rol
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>Administrator</SelectItem>
                  <SelectItem value='manager'>Warehouse Manager</SelectItem>
                  <SelectItem value='inventory'>Inventory Specialist</SelectItem>
                  <SelectItem value='driver'>Driver</SelectItem>
                  <SelectItem value='employee'>Employee</SelectItem>
                  <SelectItem value='guest'>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='sendInvitation' className='text-right'>
                Trimite invitație
              </Label>

              <div className='col-span-3 flex items-center space-x-2'>
                <Checkbox id='sendInvitation' checked={formData.sendInvitation} onCheckedChange={(checked) => handleInputChange('sendInvitation', checked as boolean)} />
                <Label htmlFor='sendInvitation' className='text-sm font-normal'>
                  Trimiteți e-mail de invitație utilizatorului
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Creați utilizator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddUserDialog;