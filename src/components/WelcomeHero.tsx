import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Center,
} from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import { Role } from '@prisma/client';
import RoleGuard from './RoleGuard';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor]?.[theme.colorScheme === 'dark' ? 4 : 6],
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    '@media (max-width: 520px)': {
      height: 42,
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

interface WelcomeHeroProps {
  heroText: {
    prefix?: string;
    text: string;
    postfix?: string;
  };
  actions: {
    color?: string;
    text: string;
    href: string;
    minimumRole?: Role;
  }[];
}

export const WelcomeHero: FC<WelcomeHeroProps> = ({ heroText, actions }) => {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Center mb="xl">
          <Image
            src="/big-logo-with-bg.jpeg"
            height="400px"
            width="400px"
            alt="Big traken logo with background"
          />
        </Center>

        <Title className={classes.title}>
          {heroText.prefix}{' '}
          <Text component="span" className={classes.highlight} inherit>
            {heroText.text}
          </Text>{' '}
          {heroText.postfix}
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Traken creators have created many compositions for you to be able to
            jam along songs with any instrument. Just disable whichever track
            you wish to play instead and start jamming!
          </Text>
        </Container>

        <div className={classes.controls}>
          {actions.map((action) => {
            return (
              <RoleGuard minimumRole={action.minimumRole ?? Role.USER}>
                <Link href={action.href} key={action.href}>
                  <Button
                    className={classes.control}
                    size="lg"
                    color={action.color}
                  >
                    {action.text}
                  </Button>
                </Link>
              </RoleGuard>
            );
          })}
        </div>
      </div>
    </Container>
  );
};
