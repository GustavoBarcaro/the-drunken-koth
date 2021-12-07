import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiAward,
  FiStar,
  FiSettings,
  FiMenu,
  FiLogOut,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { signOut } from 'next-auth/client';
import logo from '@/public/images/logo.png';
interface LinkItemProps {
  name: string;
  icon: IconType;
  url: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: `Home`, icon: FiHome, url: `/` },
  { name: `Jogadores`, icon: FiUsers, url: `/players` },
  { name: `Ligas`, icon: FiAward, url: `/leagues` },
  { name: `Últimos torneios`, icon: FiStar, url: `/tournaments` },
  { name: `Sair`, icon: FiLogOut, url: `/logout` },
];

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  link: string;
}
interface NavItemInfoProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItemInfo = ({ icon, children, ...rest }: NavItemInfoProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: `var(--green-500)`,
        color: `white`,
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: `white`,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  return link === `/logout` ? (
    <Box onClick={() => signOut()}>
      <NavItemInfo icon={icon} {...rest}>
        {children}
      </NavItemInfo>
    </Box>
  ) : (
    <Link href={link} passHref>
      <NavItemInfo icon={icon} {...rest}>
        {children}
      </NavItemInfo>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue(`white`, `gray.900`)}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue(`gray.200`, `gray.700`)}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        fontSize="2xl"
        ml="8"
        fontFamily="monospace"
        fontWeight="bold"
        textTransform="uppercase"
      >
        the drunken k.o.t.h
      </Text>
    </Flex>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue(`white`, `gray.700`)}
      borderRight="1px"
      borderRightColor={useColorModeValue(`gray.200`, `gray.700`)}
      w={{ base: `full`, md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          textTransform="uppercase"
          textAlign="center"
        >
          the drunken k.o.t.h
        </Text>
        <CloseButton display={{ base: `flex`, md: `none` }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.url}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue(`gray.100`, `gray.900`)}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: `none`, md: `block` }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: `flex`, md: `none` }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
