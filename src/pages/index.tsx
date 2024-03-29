import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { WelcomeHero } from '../components/WelcomeHero';
import { Role } from '@prisma/client';

const Home = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Traken - Home</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {session?.user && (
          <>
            <WelcomeHero
              heroText={{
                prefix: 'Welcome back, ',
                text: session.user.name ?? 'user',
              }}
              actions={[
                {
                  text: 'Explore compositions',
                  href: '/explore',
                },
                {
                  color: 'gray',
                  text: 'Create your own compositions',
                  href: '/dashboard/compositions',
                  minimumRole: Role.AUTHOR,
                },
              ]}
            />
          </>
        )}
        {!session?.user && (
          <WelcomeHero
            heroText={{
              prefix: 'Take a track and',
              text: 'jam along',
              postfix: 'by disabling any instrument!',
            }}
            actions={[
              {
                color: 'gray',
                text: 'Explore compositions',
                href: '/explore',
              },
              {
                text: 'Sign in',
                href: '/api/auth/signin',
              },
            ]}
          />
        )}
      </div>
    </>
  );
};

export default Home;
