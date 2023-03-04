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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import logo from '@/assets/logo.png';
import icon from '@/assets/icon.png';
import Image from 'next/image';


export default function Navbar() {
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
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    </Box>
  </>
  );
}