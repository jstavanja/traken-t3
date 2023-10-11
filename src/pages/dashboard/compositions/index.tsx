import { Button, Container, Group, Title } from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';
import AuthGuard from '../../../components/AuthGuard';
import { CompositionsGrid } from '../../../components/compositions/CompositionsGrid';
import AuthError from '../../../components/dashboard/AuthError';
import { trpc } from '../../../utils/trpc';
import RoleGuard from '../../../components/RoleGuard';
import { Role } from '@prisma/client';

const CompositionsListPage = () => {
  const { data: compositions } = trpc.useQuery([
    'dashboardCompositions.getAll',
  ]);

  return (
    <>
      <Head>
        <title>Traken - Compositions dashboard</title>
      </Head>
      <AuthGuard CustomError={AuthError}>
        <RoleGuard minimumRole={Role.AUTHOR}>
          <Container>
            <Group position="apart">
              <Title>Your Compositions</Title>
              <Link href={'/dashboard/compositions/new'}>
                <Button>Add new composition</Button>
              </Link>
            </Group>
            {compositions && (
              <CompositionsGrid
                compositions={compositions}
                clickLeadsToEdit={true}
              />
            )}
          </Container>
        </RoleGuard>
      </AuthGuard>
    </>
  );
};

export default CompositionsListPage;
