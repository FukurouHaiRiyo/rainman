'use client'

import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Solutii IT', href: '/Services' },
  { name: 'Solutii Software WMS', href: '/Wms' },
  { name: 'Company', href: '#' },
  { name: 'About us', href: '/About' },
]

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <nav className='flex items-center justify-between p6 lg:px8'>
      <div className='flex lg:flex-1'>
        <a href='#' className='-m-1.5 p-1.5'>
          <span>
            Rainman
          </span>

          <img className='h-8 w-auto' src='' alt='image' />
        </a>
      </div>

      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#ffffff] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Navigation Items */}
        {navigation.map(item => (
            <li
              key={item.name}
              className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-white cursor-pointer border-gray-600'
            >
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
      </ul>

      <div className='hidden lg:flex lg:gap-x-12'>
        {
          navigation.map((item) => (
            <a key={item.name} href={item.href} className='text-sm font-semibold leading-6 text-gray-900'>
              {item.name}
            </a>
          ))
        }
      </div>
    </nav>
  )
}

export default Navbar;