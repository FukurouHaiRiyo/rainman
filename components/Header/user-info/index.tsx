'use client';

import { ChevronUpIcon } from '@/assets/icons';
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { LogOutIcon, SettingsIcon, UserIcon } from './icons';

import { useAuth } from '@/app/context/AuthUserContext';
import { ref, get } from 'firebase/database';

import { db } from '@/app/lib/firebase';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {authUser, loading, signOut} = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push('/');
    }

    const fetchUserData = async () => {
      try {
        const userRef = ref(db, `users/${authUser?.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUsername(userData.username || 'Unkown user');
          setDisplayName(userData.displayName || 'Unkown Name');
          setEmail(userData.email || 'No email');
        }
      } catch (error) {
        console.log('Error fetching user from database', error);
      }
    };

    fetchUserData();
  }, [authUser]);

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className='rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark'>
        <span className='sr-only'> My account </span>

        <figure className='flex items-center gap-3'>
          <Image 
            src=''
            className='size-12'
            alt={displayName}
            role='presentation'
            width={200}
            height={200}
          />

          <figcaption className='flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only'>
            <span> { displayName } - { username } </span>

            <ChevronUpIcon 
              aria-hidden
              className={cn('rotate-180 transition-transform', isOpen && 'rotate-0')}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent className='border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]' align='end'>
        <h2 className='sr-only'> User information </h2>

        <figure className='flex items-center gap-2.5 px-5 py3.5'>
          <Image 
            src=''
            className='size-12'
            alt={displayName}
            role='presentation'
            width={200}
            height={200}
          />

          <figcaption className='space-y-1 text-base font-medium'>
            <div className='mb-2 leading-none text-dark dark:text-white'>
              {displayName}
            </div>

            <div className='leading-none text-gray-6'>{email}</div>
          </figcaption>
        </figure>

        <hr className='border-[#E8E8E8] dark:border-dark-3' />

        <div className='p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer'>
          <Link href={'/profile'} onClick={() => setIsOpen(false)} className='flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white'>
            <UserIcon />

            <span className='mr-auto text-base font-medium'> View profile </span>
          </Link>

          <Link href={'/pages/settings'} onClick={() => setIsOpen(false)} className='flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white'>
            <SettingsIcon />

            <span className='mr-auto text-base font-medium'>
              Account settings
            </span>
          </Link>
        </div>

        <hr className='border-[#E8E8E8] dark:border-dark-3'/>

        <div className='p-2 text-base text-[#4B5563] dark:text-dark-6'>
          <button className='flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white' onClick={() => setIsOpen(false)}>
            <LogOutIcon />

            <span className='text-base font-medium'> Log out </span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}

export default UserInfo;