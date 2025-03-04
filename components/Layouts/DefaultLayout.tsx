'use client';

import React, { useState, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Providers } from '@/app/provider';

export default function DefaultLayout({ children }: { children: React.ReactNode })  {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Providers>
        <div className='flex min-h-screen'>
          <Sidebar />

          <div className='w-full bg-gray-2 dark:bg-[#020d1a]'>
            <Header />

            <main>
              
            </main>
          </div>
        </div>
      </Providers>
    </>
  );
}

