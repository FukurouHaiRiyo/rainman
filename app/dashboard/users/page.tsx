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
  const [loading, isLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (isLoaded && user) {
      
    }
  })

  return (
    <div>
      
    </div>
  )
}

export default UsersPage;