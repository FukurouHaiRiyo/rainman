'use client'

import React, {useState} from 'react';

import {Box, IconButton, useBreakpointValue, Stack, Heading, Text, Container} from '@chakra-ui/react';
import {BiLeftArrowAlt, BiRightArrowAlt} from 'react-icons/bi';
import Slider from 'react-slick';

const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const About = () => {
  const [slider, setSlider] = useState<Slider | null>(null);

  const top = useBreakpointValue({base:'90%', md:'50%'});
  const side = useBreakpointValue({base: '30%', md: '40px'});

  const cards = [
    {
      title: 'Title 1',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.',
      image: 'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60'
    },

    {
      title: 'Title 2',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.',
      image: 'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80',
    },

    {
      title: 'Title 3',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.',
      image: 'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
    },
  ];

  return (
    <Box
      position='relative'
      height='600px'
      width='full'
      overflow='hidden'>
      
      <link 
        rel='stylesheet' 
        type='text/css' 
        charSet='UTF-8' 
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />

      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      <IconButton
        aria-label='left-arrow'
        variant='ghost'
        position='absolute'
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <BiLeftArrowAlt size='40px'/>
      </IconButton>


      <IconButton
        aria-label='right-arrow'
        variant='ghost'
        position='absolute'
        right={side}
        top={top}
        transform='translate(0%, -50%)'
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <BiRightArrowAlt size='40px'/>
      </IconButton>

      <Slider
        {...settings} ref={(slider) => setSlider(slider)}
      >
        {cards.map((card, index)=>(
          <Box
            key={index}
            
          >

          </Box>
        ))}
      </Slider>
    </Box>
  )
}

export default About