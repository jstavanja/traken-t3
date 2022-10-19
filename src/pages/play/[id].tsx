import { Container, Paper, Stack, Title } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import Player from "../../components/player";
import { trpc } from "../../utils/trpc";

const ViewCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const { data: composition, error } = trpc.useQuery(
    [
      "usersCompositions.getForPlay",
      {
        id: compositionId ?? "",
      },
    ],
    {
      retry: false,
      staleTime: Infinity,
    }
  );

  return (
    <>
      <Head>
        <title>Traken - Playing {composition?.name ?? "..."}</title>
      </Head>
      <AuthGuard>
        <Container>
          {composition && (
            <>
              <Stack mb="xl">
                <Title size="h1">Composition player: {composition.name}</Title>
              </Stack>
              {composition.tracks.length === 0 && (
                <h2>Composition does not yet have any tracks.</h2>
              )}
              {composition.tracks.length > 0 && (
                <>
                  <Title size="h2" mb="lg">
                    All tracks in composition
                  </Title>
                  <Paper withBorder p="xl">
                    <Player tracks={composition.tracks} />
                  </Paper>
                </>
              )}
            </>
          )}
          {error && (
            <p>
              You do not have permissions to view this composition and its
              tracks.
            </p>
          )}
        </Container>
      </AuthGuard>
    </>
  );
};

export default ViewCompositionPage;
