'use client'

import React, { useState } from 'react';
import Navbar from '@/components/navbar';

const Prices = () => {

    const [selectedOption, setSelectedOption] = useState('Basic');
    const [animate, setAnimate] = useState(false);

    const handleOptionChange = (option: any) => {
        if (option !== selectedOption) {
            setAnimate(true);
            setTimeout(() => {
                setSelectedOption(option);
                setAnimate(false);
            }, 30);
        }
    }

    return (
        <div className='relative isolate px-6 pt-1 lg:px-18'>
            <Navbar/>
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

                </div>

                <div className='font-[sans-serif]'>
                    <div className='max-w-5xl max-lg:max-w-3xl mx-auto'>
                        <div className='text-center'>
                            <h2 className='text-gray-800 text-3xl font-bold mb-3'> Choose your needs </h2>
                            <p className='text-sm text-gray-500'> Change your plan according your needs </p>
                        </div>

                        <div className='flex mx-auto mt-12 bg-gray-100 rounded-full max-w-[400px]'>
                            <button className={`text-sm w-full py-2.5 px-5 rounded-full ${selectedOption === 'Basic' ? 'text-white bg-blue-600' : 'text-gray-500'}`} onClick={() => handleOptionChange('Basic')}>
                                Basic
                            </button>

                            <button className={`text-sm w-full py-2.5 px-5 rounded-full ${selectedOption === 'Regular' ? 'text-white bg-blue-600' : 'text-gray-500'}`} onClick={() => handleOptionChange('Regular')}>
                                Regular
                            </button>

                            <button className={`text-sm w-full py-2.5 px-5 rounded-full ${selectedOption === 'Premium' ? 'text-white bg-blue-600' : 'text-gray-500'}`} onClick={() => handleOptionChange('Premium')}>
                                Premium
                            </button>

                            <button className={`text-sm w-full py-2.5 px-5 rounded-full ${selectedOption === 'IT Consulting' ? 'text-white bg-blue-600' : 'text-gray-500'}`} onClick={() => handleOptionChange('IT Consulting')}>
                                IT Consulting
                            </button>
                        </div>

                        <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-6 mt-6 max-sm:max-w-sm max-sm:mx-auto'>
                            {selectedOption == 'Basic' && (
                                <>
                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-gray-100 text-center p-4'>
                                            <h3 className='text-xl text-gray-700 mb-1'>
                                                Software/website development
                                            </h3>
                                            <p className='text-xs text-gray-700'>
                                                14 days delivery time
                                            </p>
                                        </div>

                                        <br/>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-gray-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>
                                                $50
                                            </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    1 page
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Content upload
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Responsive design
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-gray-700 hover:bg-gray-800 rounded-full'> 
                                                Get started 
                                            </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 relative'>
                                       <div className='h-32 bg-blue-600 text-center p-4'>
                                            Data Analytics
                                            <p className='text-xs text-white'> 14 days delivery time </p>
                                        </div>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-blue-600  text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>$50</h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Uncover actionable insights
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Make informed decisions
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Raw data into valuable information
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full'> Get Started </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-pink-700 text-center p-4'>
                                            <h3 className='text-xl text-white mb-1'> Mobile app development </h3>
                                            <p className='text-xs text-white'> 14 days delivery time </p>
                                        </div>
                                        
                                        <br/>
                                        
                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-pink-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'> $50 </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Realize your app vision
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Ensure seamless user experience
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-pink-700 hover:bg-pink-800 rounded-full'> 
                                                Get started
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedOption == 'Regular' && (
                                <>
                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-gray-100 text-center p-4'>
                                            <h3 className='text-xl text-gray-700 mb-1'>
                                                Software/website development
                                            </h3>
                                            <p className='text-xs text-gray-700'>
                                                21 days delivery time
                                            </p>
                                        </div>

                                        <br/>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-gray-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>
                                                $60
                                            </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    4 page
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Content upload
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Responsive design
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    How to use the app
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-gray-700 hover:bg-gray-800 rounded-full'> Get started </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 relative'>
                                       <div className='h-32 bg-blue-600 text-center p-4'>
                                            Data Analytics
                                            <p className='text-xs text-white'> 21 days delivery time </p>
                                        </div>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-blue-600  text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>$60</h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Uncover actionable decisions
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Make informed decisions
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Raw data into valuable information
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Charts included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full'> Get Started </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-pink-700 text-center p-4'>
                                            <h3 className='text-xl text-white mb-1'> Mobile app development </h3>
                                            <p className='text-xs text-white'> 21 days delivery time </p>
                                        </div>
                                        
                                        <br/>
                                        
                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-pink-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'> $60 </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Realize your app vision
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Ensure seamless user experience
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Functionality across various platforms
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    How to use the app
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-pink-700 hover:bg-pink-800 rounded-full'> 
                                                Get started
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedOption == 'Premium' && (
                                <>
                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-gray-100 text-center p-4'>
                                            <h3 className='text-xl text-gray-700 mb-1'>
                                                Software/website development
                                            </h3>
                                            <p className='text-xs text-gray-700'>
                                                30 days delivery time
                                            </p>
                                        </div>

                                        <br/>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-gray-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>
                                                $80
                                            </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    10 page
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Content upload
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Responsive design
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Design customization
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Support included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Admin dashboard
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    How to use the app
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-gray-700 hover:bg-gray-800 rounded-full'> Get started </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 relative'>
                                    <div className='h-32 bg-blue-600 text-center p-4'>
                                            Data Analytics
                                            <p className='text-xs text-white'> 30 days delivery time </p>
                                        </div>

                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-blue-600  text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'>$80</h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Uncover actionable decisions
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Make informed decisions
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Raw data into valuable information
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Charts included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Reports on data every month
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full'> Get Started </button>
                                        </div>
                                    </div>

                                    <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500 hover:scale-105'>
                                        <div className='h-32 bg-pink-700 text-center p-4'>
                                            <h3 className='text-xl text-white mb-1'> Mobile app development </h3>
                                            <p className='text-xs text-white'> 30 days delivery time </p>
                                        </div>
                                        
                                        <br/>
                                        
                                        <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-pink-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                                            <h3 className='text-2xl'> $80 </h3>
                                        </div>

                                        <div className='px-6 py-4 mt-4'>
                                            <ul className='space-y-4'>
                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Realize your app vision
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Ensure seamless user experience
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Functionality across various platforms
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    How to use the app
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Documentation included
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Support included 
                                                </li>

                                                <li className='flex items-center text-sm text-gray-500'>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                                        <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                                    </svg>
                                                    Admin dashboard
                                                </li>
                                            </ul>

                                            <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-pink-700 hover:bg-pink-800 rounded-full'> 
                                                Get started
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
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

            {selectedOption == 'IT Consulting' && (
                <div className='shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-lg overflow-hidden transition-all duration-500'>
                    <div className='h-32 bg-pink-700 text-center p-4'>
                        <h3 className='text-xl text-white mb-1'> IT Consulting </h3>
                        <p className='text-xs text-white'> Delivery time discussed on phone </p>
                    </div>

                    <br />

                    <div className='h-24 w-24 mx-auto -mt-12 shadow-xl rounded-full bg-pink-700 text-white border-[3px] flex flex-col items-center justify-center border-white'>
                        <h3 className='text-xl text-center'> Starting at $50 </h3>
                    </div>

                    <div className='px-6 py-4 mt-4'>
                        <ul className='space-y-4'>
                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                Windows/Linux installation
                            </li>

                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                Components diagnostics and replacement
                            </li>

                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                Walkthrough for different apps/issues 
                            </li>

                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                How to use different common apps 
                            </li>

                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                How to install and setup different apps
                            </li>

                            <li className='flex items-center text-sm text-gray-500'>
                                <svg xmlns='http://www.w3.org/2000/svg' width='17' className='mr-3 bg-green-500 fill-white rounded-full p-[3px]' viewBox='0 0 24 24'>
                                    <path d='M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z' data-original='#000000' />
                                </svg>
                                PC assembly 
                            </li>
                        </ul>

                        <button type='button' className='w-full mt-8 px-5 py-2.5 text-sm text-white bg-pink-700 hover:bg-pink-800 rounded-full'>
                            Get started
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Prices;