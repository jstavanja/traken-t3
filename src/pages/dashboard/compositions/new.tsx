import AuthError from "../../../components/dashboard/AuthError";
import AuthGuard from "../../../components/AuthGuard";
import { NewCompositionForm } from "../../../components/forms/NewCompositionForm";
import { Container, Title } from "@mantine/core";
import Head from "next/head";

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

export default NewCompositionPage;
