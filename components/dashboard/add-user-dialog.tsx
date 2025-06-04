'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus } from 'lucide-react'

interface AddUserDialogProps {
  onUserAdded: () => void
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'guest',
    sendInvitation: true,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      toast({
        title: formData.sendInvitation ? 'Invitație trimisă' : 'Utilizator creat',
        description: formData.sendInvitation
          ? `Invitația a fost trimisă către ${formData.email}`
          : `Utilizatorul ${formData.firstName} ${formData.lastName} a fost creat.`,
      })

      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'guest',
        sendInvitation: true,
      })
      setOpen(false)
      onUserAdded()
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast({
        title: 'Eroare',
        description: error.message || 'Nu s-a putut crea utilizatorul',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Adaugă Utilizator
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px] bg-background text-foreground shadow-xl rounded-lg'>
        <DialogHeader>
          <DialogTitle>Adaugă un nou utilizator</DialogTitle>
          <DialogDescription>
            {formData.sendInvitation
              ? 'Se va trimite un email de invitație pentru înregistrare.'
              : 'Utilizatorul va fi creat direct și trebuie să primească credențiale.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            {[
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'firstName', label: 'Prenume', type: 'text' },
              { id: 'lastName', label: 'Nume', type: 'text' },
            ].map(({ id, label, type }) => (
              <div className='grid grid-cols-4 items-center gap-4' key={id}>
                <Label htmlFor={id} className='text-right'>
                  {label}
                </Label>
                <Input
                  id={id}
                  type={type}
                  value={(formData as any)[id]}
                  onChange={(e) => handleInputChange(id, e.target.value)}
                  className='bg-background text-foreground col-span-3'
                  required
                />
              </div>
            ))}

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Alege un rol' />
                </SelectTrigger>
                <SelectContent className='bg-background text-foreground'>
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
              <Label htmlFor='sendInvitation' className='text-right'>Invitație</Label>
              <div className='col-span-3 flex items-center space-x-2'>
                <Checkbox
                  id='sendInvitation'
                  checked={formData.sendInvitation}
                  onCheckedChange={(checked) => handleInputChange('sendInvitation', checked as boolean)}
                />
                <Label htmlFor='sendInvitation' className='text-sm font-normal'>
                  Trimite email de invitație
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={loading}>
              Anulează
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {formData.sendInvitation ? 'Trimite invitația' : 'Creează utilizatorul'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
