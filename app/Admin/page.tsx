import React from 'react';
import Dashboard from '@/components/Dashboard/Dash';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

const page = () => {
  return (
    <DefaultLayout>
      <Dashboard />
    </DefaultLayout>
  )
}

export default page;