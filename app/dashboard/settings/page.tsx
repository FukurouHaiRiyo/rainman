'use client';

import React, { useEffect, useState } from 'react';

import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getRoleName } from '@/app/lib/roles';
import Link from 'next/link';

// @typescript-eslint/no-explicit-any
const Settings = () => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      // Get user role from Clerk metadata
      const role = (user.publicMetadata.role as string) || 'guest';
      setUserRole(role);
    }
  }, [isLoaded, user]);

  if (!isLoaded || !user) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'> Settings </h1>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle> Profil </CardTitle>
            <CardDescription> Informațiile și preferințele contului dvs </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4'>
                <img 
                  src={user.imageUrl || 'placeholder'}
                  alt={`${user.firstName} ${user.lastName}`}
                  className='w-16 h-16 rounded-full'
                />

                <div>
                  <h3 className='text-lg font-medium'>
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className='text-sm text-muted-foreground'>{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>

              <div className='grid gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'> Rol </span>
                  <Badge variant="outline">{getRoleName(userRole as any)}</Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Cont creat</span>
                  <span className='text-sm'>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/user-profile">
                  <Button>Editați profilul</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {userRole === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Manage system settings and users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4'>
                <p>As an administrator, you have access to additional settings and controls.</p>
                <div className='flex justify-end'>
                  <Link href='/dashboard/users'>
                    <Button>Manage Users</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Settings;