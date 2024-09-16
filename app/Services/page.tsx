'use client'
import React from 'react';
import { useState } from 'react';

import { FingerPrintIcon, XMarkIcon, DevicePhoneMobileIcon, CommandLineIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';
import Navbar from '../../components/navbar';

const services = [
    {
        name: 'Software development',
        description: 'We craft innovative solutions tailored to your needs.',
        icon: CommandLineIcon,
    },

    {
        name: 'Mobile app development',
        description: 'Turn your app idea into a user-friendly reality.',
        icon: DevicePhoneMobileIcon,
    },

    {
        name: 'Data analytics',
        description: 'Gain valuable insights through data-driven strategies.',
        icon: PresentationChartLineIcon,
    },

    {
        name: 'It consulting',
        description: 'Learn more about phones or computers, or get your computers repaired/upgraded',
        icon: FingerPrintIcon,
    },
]

const Services = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className='bg-white py-24 sm:py-32'>
            <header className='absolute inset-x-0 top-0 z-50' aria-label='Global'>
                <Navbar />

                <Dialog className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className='fixed inset-0 z-50' />

                    <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
                        <div className='flex items-center justify-between'>
                            <a href='#' className='-m-1-5 p-1.5'>
                                <span className='sr-only'>Rainman</span>
                                <img className='h-8 w-auto' src='' alt='image' />
                            </a>

                            <button type='button' className='-m-2.5 rounded-md p-2.5 text-gray-700' onClick={() => setMobileMenuOpen(false)}>
                                <span className='sr-only'> Close Menu</span>
                                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                            </button>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                <div className='mx-auto max-w-2xl lg:text-center'>
                    <h2 className='text-base font-semibold leading-7 text-indigo-600'> Deploy faster </h2>
                    <p className='mt-2 text-2xl font-bold tracking-tight text-green-500 sm:text-3xl'>
                        Our services
                    </p>

                    <p className='mt-6 text-lg leading-8 text-gray-600'>
                        Empowering businesses through Cutting-Edge technology.
                        Enhance your business operations with our tailored software solutions and strategic IT consulting services.
                    </p>
                </div>

                <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
                    <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
                        {services.map((service) => (
                            <div key={service.name} className='relative pl-16'>
                                <dt className='text-base font-semibold leading-7 text-gray-900'>
                                    <div className='absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
                                        <service.icon className='h-6 w-6 text-white' aria-hidden='true' />
                                    </div>
                                    {service.name}
                                </dt>

                                <dd className='mt-2 text-base leading-7 text-gray-600'>{service.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            
            <br/>
            <br/>
            <br/>

            <div className='font-[sans-serif] space-x-4 space-y-4 text-center'>
                <a href='/Prices'>
                    <button type='button' className='px-5 py-2.5 rounde-lg text-white text-sm tracking-wide font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700'>
                        View our prices
                    </button>
                </a>
            </div>
        </div>
    )
}

export default Services;