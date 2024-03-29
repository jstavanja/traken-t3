import { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  Button,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconChevronDown } from '@tabler/icons';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ColorThemeSwitcher } from '../ColorSchemeSwitcher';
import RoleGuard from '../RoleGuard';
import { Role } from '@prisma/client';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark?.[6]
        : theme.colors.gray?.[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray?.[2]
    }`,
    marginBottom: 20,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark?.[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark?.[8] : theme.white,
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark?.[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark?.[5]
          : theme.colors.gray?.[1],
    },

    '&[data-active]': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark?.[7] : theme.white,
      borderColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark?.[7]
          : theme.colors.gray?.[2],
    },
  },
}));

const NAVIGATION_ITEMS = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Compositions',
    href: '/explore',
  },
  {
    title: 'Dashboard',
    href: '/dashboard/compositions',
    if: {
      loggedIn: true,
      minimumRole: Role.AUTHOR,
    },
  },
];

export const DefaultHeader = () => {
  const { classes, cx } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Link href="/" passHref>
            <a>
              <Image
                src={colorScheme === 'light' ? '/logo.png' : '/logo-bright.png'}
                alt="Traken logo with a DJ on the picture"
                height="60px"
                width="200px"
              />
            </a>
          </Link>

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          {status === 'unauthenticated' && (
            <Link href="/api/auth/signin" passHref>
              <a>
                <Button variant="default">Log in</Button>
              </a>
            </Link>
          )}
          {status === 'authenticated' && (
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={session?.user?.image}
                      alt={session?.user?.name ?? 'Users avatar'}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {session?.user?.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => signOut()}>
                  <Group>
                    <ActionIcon variant="outline" title="Toggle color scheme">
                      <IconLogout size={14} stroke={1.5} />
                    </ActionIcon>
                    Logout
                  </Group>
                </Menu.Item>
                <Menu.Item>
                  <ColorThemeSwitcher />
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
      <Container>
        <Tabs
          value={router.pathname}
          onTabChange={(value) => router.push(`/${value}`)}
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>
            {NAVIGATION_ITEMS.map(
              (item) =>
                !(status !== 'authenticated' && item.if?.loggedIn) && (
                  <RoleGuard minimumRole={item.if?.minimumRole ?? Role.USER}>
                    <Tabs.Tab value={item.href} key={item.href}>
                      {item.title}
                    </Tabs.Tab>
                  </RoleGuard>
                )
            )}
          </Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
};
