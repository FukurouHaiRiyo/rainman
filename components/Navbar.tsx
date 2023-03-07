import { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  Button,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
} from '@chakra-ui/react';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '@/assets/logo.png';
import icon from '@/assets/icon.png';
import Image from 'next/image';

import { BrowserRouter as Router, Link, NavLink, Route, Routes } from 'react-router-dom';

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={3} alignItems={'center'}>
            <Box bg={useColorModeValue('gray.100', 'gray.900')}>
              <Box>
                <Image
                  width={90}
                  height={90}
                  src={logo}
                  alt='logo'
                />
              </Box>
            </Box>
            <HStack
              as={'nav'}
              spacing={2}
              display={{ base: 'none', md: 'flex' }}>
            </HStack>
            <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Image
                  width={70}
                  height={70}
                  src={icon}
                  alt='logo'
                />
              </MenuButton>

              <HStack spacing={8} alignItems={'center'}>
                <HStack
                  as={'nav'}
                  spacing={4}
                  display={{ base: 'none', md: 'flex' }}>
                    <Stack
                      flex={{ base: 1, md: 0 }}
                      justify={'flex-left'}
                      direction={'row'}
                      spacing={6}>
                    <Button
                        as={'a'}
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'pink.400'}
                        href={'/Team'}
                        _hover={{
                          bg: 'pink.300',
                        }}> 
                      Team
                    </Button>
                    
                    <Button
                        as={'a'}
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'pink.400'}
                        href={'/About'}
                        _hover={{
                          bg: 'pink.300',
                        }}> 
                      About
                    </Button>

                    <Button
                        as={'a'}
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'pink.400'}
                        href={'/Contact'}
                        _hover={{
                          bg: 'pink.300',
                        }}> 
                      Contact
                    </Button>
                  </Stack>
                </HStack>
              </HStack>
            </Menu>
          </Flex>
        </HStack>
      </Flex>

      {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-left'}
              direction={'row'}
              spacing={6}>
              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'/Team'}>
                Team
              </Button>

              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'/About'}>
                About
              </Button>

              <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}
                href={'/Contact'}>
                Contact
              </Button>
            </Stack>
          </Box>
        ) : null}
    </Box>
  </>
  );
}