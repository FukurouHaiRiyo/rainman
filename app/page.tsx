"use client"
import HeroSection from '@/components/HeroSection'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import Pricing from '@/components/Pricing'

export default function Home() {
  return (
    <>
      <HeroSection/>
      <Features/>
      <Pricing/>
      <Testimonials/>
      <Footer/>
    </>
  )
}
