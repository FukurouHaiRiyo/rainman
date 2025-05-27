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
import AddUserDialog from '@/components/dashboard/add-user-dialog';

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
    <div>
      
    </div>
  )
}

export default UsersPage;