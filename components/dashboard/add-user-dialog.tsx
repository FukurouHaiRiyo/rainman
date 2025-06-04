'use client'

import type React from 'react'

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
import { Loader2, Plus, AlertCircle, Copy } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AddUserDialogProps {
  onUserAdded: () => void
}

export function AddUserDialog({ onUserAdded }: AddUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [successData, setSuccessData] = useState<any>(null)
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
    setError(null)
    setErrorDetails(null)
    setSuccessData(null)

    try {
      console.log('Submitting user creation request:', formData)

      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

      if (data.error) {
        setError(data.error)
        setErrorDetails(data.details)

        toast({
          title: 'Error',
          description: `${data.error}${data.suggestion ? ` - ${data.suggestion}` : ''}`,
          variant: 'destructive',
        })
        return
      }

      // Handle success
      setSuccessData(data)

      if (data.invitationSent) {
        toast({
          title: 'Invitation Sent',
          description: `Invitation email sent to ${formData.email}. They will receive an email to complete their registration.`,
        })
      } else if (data.user?.tempPassword) {
        toast({
          title: 'User Created',
          description: `User created with temporary password. Please share login credentials.`,
        })
      } else {
        toast({
          title: 'User Created',
          description: `User ${formData.firstName} ${formData.lastName} has been created successfully.`,
        })
      }

      // Don't close dialog immediately if there's a temp password to show
      if (data.user?.tempPassword) {
        // Reset form and close dialog
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          role: 'guest',
          sendInvitation: true,
        })
        setError(null)
        setErrorDetails(null)
        setSuccessData(null)
        setOpen(false)
        onUserAdded()
      }
    } catch (error: any) {
      console.error('Error creating user:', error)
      setError('Network error occurred')
      setErrorDetails(error.message)

      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })
  }

  const handleClose = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'guest',
      sendInvitation: true,
    })
    setError(null)
    setErrorDetails(null)
    setSuccessData(null)
    setOpen(false)
    onUserAdded()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            {formData.sendInvitation
              ? 'Send an invitation email to the user. They will complete their registration via email.'
              : 'Create a user account directly. The user will need to be given login credentials separately.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              <div className='space-y-2'>
                <div>
                  <strong>Error:</strong> {error}
                </div>
                {errorDetails && (
                  <div className='text-sm'>
                    <strong>Details:</strong>
                    <pre className='mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32'>
                      {typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {successData?.user?.tempPassword && (
          <Alert>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              <div className='space-y-2'>
                <div>
                  <strong>User Created Successfully!</strong>
                </div>
                <div className='text-sm'>
                  <strong>Email:</strong> {successData.user.email}
                </div>
                <div className='text-sm flex items-center gap-2'>
                  <strong>Temporary Password:</strong>
                  <code className='bg-gray-100 px-2 py-1 rounded'>{successData.user.tempPassword}</code>
                  <Button size='sm' variant='outline' onClick={() => copyToClipboard(successData.user.tempPassword)}>
                    <Copy className='h-3 w-3' />
                  </Button>
                </div>
                <div className='text-xs text-gray-600'>
                  Please share these credentials with the user. They will need to change their password on first login.
                </div>
                <Button size='sm' onClick={handleClose}>
                  Close
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                First Name
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
                Last Name
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
                Role
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
                Send Invitation
              </Label>
              <div className='col-span-3 flex items-center space-x-2'>
                <Checkbox
                  id='sendInvitation'
                  checked={formData.sendInvitation}
                  onCheckedChange={(checked) => handleInputChange('sendInvitation', checked as boolean)}
                />
                <Label htmlFor='sendInvitation' className='text-sm font-normal'>
                  Send invitation email (recommended)
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
              {formData.sendInvitation ? 'Send Invitation' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
