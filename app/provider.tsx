'use client'

import { SidebarProvider } from '@/components/Sidebar/sidebar-context';
import { ThemeProvider } from 'next-themes';


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="light" attribute="class">
            <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
    )
}