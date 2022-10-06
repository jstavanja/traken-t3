import { Button, Container, Group, Paper, Stack, Title } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import { trpc } from "../../utils/trpc";

const ViewCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const [isPlaying, setIsPlaying] = useState(false);

  const { data: composition, error } = trpc.useQuery(
    [
      "usersCompositions.getForPlay",
      {
        id: compositionId ?? "",
      },
    ],
    {
      retry: false,
    }
  );

  const playAll = () => {
    setIsPlaying(true);
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.play();
    });
  };

  const stopAll = () => {
    setIsPlaying(false);
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.pause();
      audioElement.currentTime = 0.0;
    });
  };

  const pauseAll = () => {
    setIsPlaying(false);
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.pause();
    });
  };

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
                    {composition.tracks?.map((track) => (
                      <div key={track.id}>
                        <h4>{track.name}</h4>
                        <audio controls id={`track-${track.id}`}>
                          <source src={track.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ))}
                  </Paper>
                  <Group mt="xl">
                    {!isPlaying && (
                      <Button color="green" onClick={playAll}>
                        Play active tracks
                      </Button>
                    )}
                    {isPlaying && (
                      <Button color="orange" onClick={pauseAll}>
                        Pause all tracks
                      </Button>
                    )}
                    <Button color="gray" onClick={stopAll}>
                      Stop and reset all tracks
                    </Button>
                  </Group>
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
