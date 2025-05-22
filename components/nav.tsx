'use client';

import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserRole } from '@/context/user-context';
import { Badge } from '@/components/ui/badge';
import { useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export function Navbar() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [notifications, setNotifications] = useState(3)
  const { roleName } = useUserRole()

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4 md:px-6'>
        <div className='ml-auto flex items-center gap-4'>
          <Badge variant='outline' className='hidden md:flex'>
            {roleName}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='relative'>
                <Bell className='h-5 w-5' />
                {notifications > 0 && (
                  <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground'>
                    {notifications}
                  </span>
                )}
                <span className='sr-only'>Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <span className='font-medium'>New order received</span>
                  <span className='text-xs text-muted-foreground'>2 minutes ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <span className='font-medium'>Low stock alert</span>
                  <span className='text-xs text-muted-foreground'>1 hour ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className='flex flex-col gap-1'>
                  <span className='font-medium'>Driver check-in</span>
                  <span className='text-xs text-muted-foreground'>3 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='cursor-pointer' onClick={() => setNotifications(0)}>
                Mark all as read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='relative h-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt={user?.fullName || "User"} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className='sr-only'>User menu</span>
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>
                <div className='flex flex-col'>
                  <span>{user?.fullName}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user?.emailAddresses?.[0]?.emailAddress ?? ''}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
