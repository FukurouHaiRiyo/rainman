'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRoleName } from '@/app/lib/roles';
import { AddUserDialog } from '@/components/dashboard/add-user-dialog';

interface User {
  id: string;
  firstName: string | null
  lastName: string | null
  email: string | null
  imageUrl: string | null
  role: string
  createdAt: string
  lastSignInAt: string | null
}

// @typescript-eslint/no-explicit-any
const UsersPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (isLoaded && user) {
      const userRole = user.publicMetadata.role as string;
      if (userRole !== 'admin'){
        toast({
          title: 'Acces interzis',
          description: 'Nu aveți permisiunea de a vizualiza această pagină',
          variant: 'destructive'
        });

        router.push('/dashboard');
      } else {
        fetchUsers();
      }
    }
  }, [isLoaded, user, router, toast]);

  const fetchUsers = async () => {
    try{
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users);
    } catch(error){
      console.log('Error fetching users: ', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut prelua utilizatorii',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const updateUserRole = async(userId: string, role: string) => {
    setUpdating(userId);

    try {
      const response = await fetch(`/api/users/${userId}/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update user in the local state
      setUsers(users.map((user: any) => (user.id === userId ? { ...user, role }: user)));

      toast({
        title: 'Succes',
        description: 'Rolul utilizatorului a fost actualizat cu succes'
      })
    } catch(error) {
      console.log('Error updating user role: ', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut actualiza rolul de utilizator',
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  }

  const handleUserAdded = () => {
    fetchUsers();
  }

  if (!isLoaded || loading) {
    <div className='flex h-screen items-center justify-center'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
    </div>
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'> Managementul utilizatorilor </h1>

        <div className='flex gap-2'>
          <Button onClick={fetchUsers} variant='outline' size='sm' disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <AddUserDialog onUserAdded={handleUserAdded} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> Utilizatori: ({users.length})</CardTitle>
          <CardDescription> Gestionați rolurile și permisiunile utilizatorilor </CardDescription>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>Nu s-au găsit utilizatori</p>
            </div>
          ): (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-2'>
                        <img 
                          src={user.imageUrl || '/placeholder.svg?height=32&width=32'}
                          alt={`${user.firstName} ${user.lastName}`}
                          className='w-8 h-8 rounded-full'
                        />

                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell> {user.email} </TableCell>

                    <TableCell>
                      <Badge variant='outline'>{getRoleName(user.role as any)}</Badge>
                    </TableCell>

                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                    <TableCell>
                      {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Never'}
                    </TableCell>

                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => updateUserRole(user.id, value)}
                          disabled={updating === user.id}
                        >
                          <SelectTrigger className='w-[140px]'>
                            <SelectValue placeholder='Select role' />
                          </SelectTrigger>
                          <SelectContent className='radix-dialog-content'>
                            <SelectItem value='admin'>Administrator</SelectItem>
                            <SelectItem value='manager'>Warehouse Manager</SelectItem>
                            <SelectItem value='inventory'>Inventory Specialist</SelectItem>
                            <SelectItem value='driver'>Driver</SelectItem>
                            <SelectItem value='employee'>Employee</SelectItem>
                            <SelectItem value='guest'>Guest</SelectItem>
                          </SelectContent>
                        </Select>
                        {updating === user.id && <Loader2 className='h-4 w-4 animate-spin text-primary' />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UsersPage;