import { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  Stack,
  Link,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '@/assets/logo.png';
import icon from '@/assets/icon.png';
import Image from 'next/image';
import { NavLink } from 'react-router-dom';

const Links = ['Echipa', 'DespreNoi', 'Contact']

// const NavLink = ({ children }: { children: ReactNode }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={'md'}
//     _hover={{
//       textDecoration: 'none',
//       bg: useColorModeValue('gray.200', 'gray.700'),
//     }}
//     href={'#'}
//     >
//     {children}
//   </Link>
// );

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
                  <Link href='/DespreNoi'>Despre noi</Link>
                  <Link href='/Contact'>Contact</Link>
                  <Link href='/Preturi'>Preturi</Link>
                </HStack>
              </HStack>
            </Menu>
          </Flex>
        </HStack>
      </Flex>

      {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <Link href='/DespreNoi'>Despre noi</Link>
              <Link href='/Contact'>Contact</Link>
              <Link href='/Preturi'>Preturi</Link>
            </Stack>
          </Box>
        ) : null}
    </Box>
  </>
  );
}

export const DespreNoi = () => {
  return (
    <div>aaa</div>
  );
}