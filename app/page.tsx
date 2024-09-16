'use client'

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';
import ContactUs from './Contact/page';

const navigation = [
  {name: 'Solutii IT', href: '/Services'},
  {name: 'About us', href: '/AboutUs'},
  {name: 'Solutii Software WMS', href: '/Wms'},
  {name: 'Company', href: '#'},
]

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='bg-white'>
      <header className='absolute inset-x-0 top-0 z-50' aria-label='Global'>
        <Navbar/>

        <Dialog className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className='fixed inset-0 z-50'/>

          <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
            <div className='flex items-center justify-between'>
              <a href='#' className='-m-1-5 p-1.5'>
                <span className='sr-only'>Rainman</span>
                <img className='h-8 w-auto' src='final_icon.png' alt='image'/>
              </a>

              <button type='button' className='-m-2.5 rounded-md p-2.5 text-gray-700' onClick={() => setMobileMenuOpen(false)}>
                <span className='sr-only'> Close Menu</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true'/>
              </button>
            </div>

            <div className='mt-6 flow-root'>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className='relative isolate px-6 pt-14 lg:px-18'>
        <div className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80' aria-hidden='true'>
        <div
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
          <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
            <div className='relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-play-900/10 hover:ring-gray-900/20'>
              Rainman is opening. {' '}

              <a href='#' className='font-semibold text-indigo-600'>
                <span className='absolute inset-0' aria-hidden='true'/>

                Read more <span aria-hidden='true'></span>
              </a>
            </div>
          </div>

          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Rainman consulting services
            </h1>

            <p className='mt-6 text-lg leading-8 text-gray-800'>
            Optimizați-vă tehnologia și infrastructura de gestionare a depozitelor cu experți IT și consultanță în managementul depozitelor
            </p>

            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a href='/Services' className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focu-visible:outline-2 focus-visible:outline-indigo-600'>
                Vizualizati servicii
              </a>

              <a href='/AboutUs' className='text-sm font-semibold leading-6 text-gray-900'>
                Aflați mai multe <span aria-hidden='true'> → </span>
              </a>
            </div>
          </div>
        </div>

        <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]' aria-hidden='true'>
          <div
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      <ContactUs/>
    </div>
  );
}

export default Home;
