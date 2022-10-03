import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import { Container, Title } from "@mantine/core";
import { CompositionsGrid } from "../../components/compositions/CompositionsGrid";

const Home: NextPage = () => {
  const { data: compositions } = trpc.useQuery(["compositions.getAll"]);

  return (
    <>
      <Head>
        <title>Traken - Explore compositions</title>
      </Head>
      <Container>
        <Title>Compositions</Title>
        {compositions && <CompositionsGrid compositions={compositions} />}
      </Container>
    </>
  );
};

export default Home;
