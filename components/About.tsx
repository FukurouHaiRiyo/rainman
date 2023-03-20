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
  

  return (
    <div>
      
    </div>
  )
}

export default About