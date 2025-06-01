'use client'

import React, { useState } from 'react';


// const navigation = [
//   { name: 'Home', href: '/' },
//   { name: 'Solutii IT', href: '/Services' },
//   { name: 'Solutii WMS', href: '/Wms' },
//   { name: 'Company', href: '#' },
//   { name: 'Despre noi', href: '/About' },
//   // { name: 'Portal clienti', href: '/auth/signIn'},
// ]

const Navbar = () => {
  const [nav, setNav] = useState(false);

  // const handleNav = () => {
  //   setNav(!nav);
  // };

  return (
    <nav className='flex items-center justify-between p6 lg:px8'>

    </nav>
  )
}

export default Navbar;