'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';

import { CameraIcon } from './_components/icons';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

import { useAuth } from '@/app/context/AuthUserContext';
import { ref, get } from 'firebase/database';

import { db } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const {authUser, loading, signOut} = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fullName, setFullName] = useState('');
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
          setFullName(userData.fullname || 'Unknown full name')
          setEmail(userData.email || 'No email');
        }
      } catch (error) {
        console.log('Error fetching user from database', error);
      }
    };

    fetchUserData();
  }, [authUser]);

  const [data, setData] = useState({
    name: 'Name Surname',
    profilePhoto: '',
    coverPhoto: ''
  });

  const handleChange = (e: any) => {
    if (e.target.value === 'profilePhoto') {
      const file = e.target?.files[0];

      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.value === 'coverPhoto') {
      const file = e.target?.files[0];

      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <DefaultLayout>
      <div className='mx-auto w-full max-w-[970px]'>
        <Breadcrumb pageName='Profile' />

        <div className='overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card'>
          <div className='relative z-20 h-35 md:h-65'>
            <Image 
              src={`https://eu.ui-avatars.com/api/?name=${fullName}&size=250x700`}
              alt={'PFP'}
              className='h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center'
              width={970}
              height={260}
              style={{
                width: 'auto',
                height: 'auto'
              }}
            />

            <div className='absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4'>
              <label htmlFor='cover' className='flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90'>
                <input 
                  type='file'
                  name='coverPhoto'
                  id='coverPhoto'
                  className='sr-only'
                  onChange={handleChange}
                  accept='image/png, image/jpg, image/jpeg'
                />

                <CameraIcon />

                <span> Edit </span>
              </label>
            </div>
          </div>

          <div className='px-4 pb-6 text-center lg:pb-8 xl:pb-11.5'>
            <div className='relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3'>
              <div className='relative drop-shadow-2'>
                  <>
                  <Image
                    src={`https://eu.ui-avatars.com/api/?name=${fullName}&size=250`}
                    width={160}
                    height={160}
                    className='overflow-hidden rounded-full'
                    alt=''
                  />

                  <label
                    htmlFor='profilePhoto'
                    className='absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2'
                  >
                    <CameraIcon />

                    
                    <input
                      type='file'
                      name='profilePhoto'
                      id='profilePhoto'
                      className='sr-only'
                      onChange={handleChange}
                      accept='image/png, image/jpg, image/jpeg'
                    />
                  </label>
                </>
              </div>
            </div>

            <div className='mt-4'>
              <h3 className='mb-1 text-heading-6 font-bold text-dark dark:text-white'>
                Full name: {fullName} (Username/Display name: {username} - {displayName})
              </h3>

              <p className='font-medium'> Ocupatie </p>

              <div className='mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card'>
                <div className='flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row'>
                  <span className='font-medium text-dark dark:text-white'>
                    259
                  </span>

                  <span className='text-body-sm'> ... </span>
                </div>

                <div className='flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row'>
                  <span className='font-medium text-dark dark:text-white'>
                    129k
                  </span>

                  <span className='text-body-sm'> ... </span>
                </div>

                <div className='flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row'>
                  <span className='font-medium text-dark dark:text-white'>
                    2k
                  </span>

                  <span className='text-body-sm-sm'> ,,, </span>
                </div>
              </div>

              <div className='mx-auto max-w-[720px]'>
                <h4 className='font-medium text-dark dark:text-white'>
                  Despre mine
                </h4>

                <p className='mt-4'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Pellentesque posuere fermentum urna, eu condimentum mauris
                  tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                  ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                  pharetra ligula sed, aliquam lacus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Profile;