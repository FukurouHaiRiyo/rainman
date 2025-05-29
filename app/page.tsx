import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import Blog from '@/components/Blog/page';
// import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
// import Features from '@/components/Features';
import Hero from '@/components/Hero/page';
// import Pricing from '@/components/Pricing';
// import Testimonials from '@/components/Testimonials';
// import Video from '@/components/Video';
import { Metadata } from 'next';
import Pricing from './Prices/page';

export const metadata: Metadata = {
  title: 'Free Next.js Template for Startup and SaaS',
  description: 'This is Home for Startup Nextjs Template',
  // other metadata
};

export default async function Home() {
  const { userId } = await auth()

  // If signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  // // If not signed in, redirect to sign-in page
  // redirect('/sign-in')
  return (
    <>
      
      <ScrollUp />
      <Hero />
      {/* <Features /> */}
      {/* <Video />
      <Brands /> */}
      {/* <AboutSectionOne />
      <AboutSectionTwo /> */}
      <Pricing />
      <Blog />
    </>
  );
}
