'use client'

import React from 'react';
import Dashboard from './Dash';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

export const metadata: Metadata = {
  title: 'Rainman Dashboard',
  description: 'Dashboard'
}

const DashboardPage = () => {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  )
}

export default DashboardPage;