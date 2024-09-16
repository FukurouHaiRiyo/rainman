'use client';

import React, {useState} from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/navbar';
import ContactUs from '../Contact/page';

const AboutUs = () => {
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
                <img className='h-8 w-auto' src='assets/final_icon.png' alt='image'/>
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

        <div className='mx-auto max-w-5xl py-32 sm:py-48 lg:py-56'>
          <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Rainman consulting services
            </h1>
          </div>

          <section className='py-14 lg:py-24 relative'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-9'>
                <div className='img-box'>
                  <img src='https://pagedone.io/asset/uploads/1702034769.png' alt='About Us tailwind page' className='max-lg:mx-auto'/>
                </div>

                <div className='lg:pl-[100px] items-center'>
                  <div className='data w-full'>
                    <h2 className='font-manrope font-bold text-4xl lg:text-5xl text-black mb-9 max-lg:text-center relative'>
                      About us
                    </h2>

                    <p className='font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto'>
                      Driven by a passion for seamless user experiences, we`ve meticulously curated pagedone to empower creators, designers, and developers alike. Our mission is to provide a comprehensive toolkit, enabling you to build intuitive, beautiful interfaces that resonate with users on every interaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='py-14 lg:py-24 relative'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
              <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-9'>
                <div className='lg:pr-24 flex items-center'>
                  <div className='data w-full'>
                    <img src='https://pagedone.io/asset/uploads/1702034785.png' alt='About Us tailwind page' className='block lg:hidden mb-9 mx-auto'/>

                    <h2 className='font-manrope font-bold text-4xl lg:text-5xl text-black mb-9 max-lg:text-center'>
                      We are creative since 2022
                    </h2>

                    <p className='font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto'>
                      Rainman isn’t just a collection of components and guidelines; it's a philosophy. We go
                      beyond aesthetics, prioritizing accessibility, scalability, and usability. Every element,
                      from the tiniest
                      detail to the grandest layout, is meticulously crafted to enhance functionality and elevate
                      user
                      satisfaction.
                    </p>
                  </div>
                </div>

                <div className='img-box'>
                    <img src='https://pagedone.io/asset/uploads/1702034785.png' alt='About Us tailwind page' className='hidden lg:block'/>
                </div>
              </div>
            </div>
          </section>

          {/* <section className='py-20 bg-white'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <h2 className='font-manrope text-4xl text-center text-gray-900 font-bold mb-14'>
                Our results
              </h2>

              <div className='flex flex-col gap-5 xl:gap-8 lg:flex-row lg:justify-between'>
                <div className='w-full max-lg:max-w-2xl mx-auto lg:mx-0 lg:w-1/3 bg-white p-6 rounded-2xl shadow-md shadow-gray-100'>
                  <div className='flex gap-5'>
                    <div className='font-manrope text-2xl font-bold text-indigo-600'>
                      240%
                    </div>

                    <div className='flex-1'>
                      <h4 className='text-xl text-gray-900 font-semibold mb-2'> Company growth </h4>
                      <p className='text-xs text-gray-500 leading-5'> Company's growth journey as we continually innovate and drive towards new heights of success</p>
                    </div>
                  </div>
                </div>

                <div className='w-full max-lg:max-w-2xl mx-auto lg:mx-0 lg:w-1/3 bg-white p-6 rounded-2xl shadow-md shadow-gray-100'>
                  <div className='flex gap-5'>
                    <div className='font-manrope text-2xl font-bold text-indigo-600'>
                      175+
                    </div>

                    <div className='flex-1'>
                      <h4 className='text-xl text-gray-900 font-semibold mb-2'>
                        Company growth
                      </h4>

                      <p className='text-xs text-gray-500 leading-5'> Our very talented team members are the powerhouse of pagedone and pillars of our success.</p>
                    </div>
                  </div>
                </div>

                <div className='w-full max-lg:max-w-2xl mx-auto lg:mx-0 lg:w-1/3 bg-white p-6 rounded-2xl shadow-md shadow-gray-100'>
                  <div className='flex gap-5'>
                    <div className='font-manrope text-2xl font-bold text-indigo-600'>
                      625+
                    </div>

                    <div className='flex-1'>
                      <h4 className='text-xl text-gray-900 font-semibold mb-2'> Projects completed</h4>
                      <p className='text-xs text-gray-500 leading-5'>We have accomplished more than 625 projects worldwide and we are still counting many more.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* <section class='py-24'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='mb-14 flex flex-col justify-center items-center sm:flex-row sm:items-center sm:justify-between max-sm:gap-8'>
                <h2 className='text-4xl text-center font-bold text-gray-900 lg:flex-left'> Testimonials </h2>
              </div>

              <div className='lg:flex grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8 swiper mySwiper'>
                <div className='swiper-wrapper'>
                  <div className='swiper-slide group bg-white border border-solid h-auto border-gray-300 rounded-2xl p-6 transition-all duration-500 w-full hover:border-indigo-600 slide-active:border-indigo-600'>
                    <div className='flex items-center gap-5'>
                      <img src='https://pagedone.io/asset/uploads/1696229969.png' alt='avatar'/>

                      <div className='grid gap-1'>
                        <h5 className='text-gray-900 font-medium transition-all duration-500 group-hover:text-indigo-600 swiper-slide-active:text-indigo-600'>
                          Jane D
                        </h5>

                        <span className='text-sm leading-6 text-gray-500'> CEO </span>
                      </div>
                    </div>

                    <div className='flex items-center mb-5 sm:mb-9 gap-2 text-amber-500 transition-all duration-500'>
                      <svg className='w-5 h-5' viewBox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z' fill='currentColor'></path>
                      </svg>

                      <svg class='w-5 h-5' viewBox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z' fill='currentColor'></path>
                      </svg>
                                    
                      <svg class='w-5 h-5' viewBox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z' fill='currentColor'></path>
                      </svg>
                                    
                      <svg class='w-5 h-5' viewBox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z' fill='currentColor'></path>
                      </svg>
                                    
                      <svg class='w-5 h-5' viewBox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z' fill='currentColor'></path>
                      </svg>
                    </div>

                    <p className='text-sm text-gray-500 leading-6 trasition-all duration-500 min-h-24 group-hover:text-gray-800'>
                      The user interface of this pagedone is so intuitive, I was able to start using it
                      without any guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section> */}
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
  )
}

export default AboutUs;