import AuthError from '../../../components/dashboard/AuthError';
import AuthGuard from '../../../components/AuthGuard';
import { NewCompositionForm } from '../../../components/forms/NewCompositionForm';
import { Container, Title } from '@mantine/core';
import Head from 'next/head';
import { AuthConfig } from '../../../types/auth';
import { Role } from '@prisma/client';
import { DASHBOARD_AUTH_CONFIG } from '../../../constants/authConfigs';

const NewCompositionPage = () => {
  return (
    <>
      <Head>
        <title>Traken - Create a new composition</title>
      </Head>
      <AuthGuard CustomError={AuthError}>
        <Container>
          <Title size="h1">Create new composition</Title>
          <NewCompositionForm />
        </Container>
      </AuthGuard>
    </>
  );
};

NewCompositionPage.clientSideAuthConfig = DASHBOARD_AUTH_CONFIG;

export default NewCompositionPage;
