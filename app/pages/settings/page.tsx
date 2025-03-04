import React from 'react';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import PersonalInfo from './_components/personal_info';
import UploadPhotoForm from './_components/upload-photo';
import DefaultLayout from '@/components/Layouts/DefaultLayout';


const SettingsPage = () => {
  return (
    <DefaultLayout>
      <div className='mx-auto w-full max-w-[1080px]'>
        <Breadcrumb pageName='Settings' />

        <div className='grid grid-cols-5 gap-8'>
          <div className='col-span-5 xl:col-span-3'>
            <PersonalInfo />
          </div>

          <div className='col-span-5 xl:col-span-2'>
            <UploadPhotoForm />
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default SettingsPage;