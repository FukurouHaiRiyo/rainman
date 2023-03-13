'use client'

import React from 'react';
import {Container, Flex, Box, Heading, Text, IconButton, 
Button, VStack, HStack, Wrap, WrapItem, FormControl, FormLabel, Input, InputGroup,
InputLeftElement, Textarea} from '@chakra-ui/react';

import {MdPhone, MdEmail, MdLocationOn, MdFacebook, MdOutlineEmail} from 'react-icons/md';
import {BsGithub, BsDiscord, BsPerson} from 'react-icons/bs';

const Contact = () => {
  return (
    <Container bg='#9DC4FB' maxW={'full'} mt={0} centerContent overflow='hidden'>
      <Flex>
        <Box
          bg='#02054B'
          color='white'
          borderRadius={'lg'}
          m={{ sm: 4, md: 16, lg: 10 }}
          p={{ sm: 5, md: 5, lg: 16 }}
        >
          <Box p={4}>
            <Wrap spacing={{base:20, sm:3, md:5, lg:20}}>
              <WrapItem>
                <Box>
                  <Heading>Contact</Heading>

                  <Text mt={{sm:3, md:3, lg:5}} color='gray.500'>
                    Fill up the form to get in contact with us
                  </Text>

                  <Box py={{base: 5, sm: 5, md: 8, lg: 10}}>
                    <VStack pl={0} spacing={3} alignItems='flex-start'>
                      <Button
                        size='md'
                        height='48px'
                        width='200px'
                        variant='ghost'
                        color='#DCE2FF'
                        _hover={{border: '2px solid #1C6FEB'}}
                        leftIcon={<MdPhone color='#1970F1' size='20px'/>}
                      >
                        Numar de tel
                      </Button>

                      <Button
                        
                      >

                      </Button>
                    </VStack>
                  </Box>
                </Box>
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
      </Flex>
    </Container>
  )
}

export default Contact