import React from 'react';
import Dashboard from '@/components/dashboard';
import { UserProvider } from '@/context/user-context';

const page = () => {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  )
}

export default page;