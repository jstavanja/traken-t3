import Link from "next/link";
import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { trpc } from "../../utils/trpc";
import { Button, Container } from "@mantine/core";

import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { IconMusic } from "@tabler/icons";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark?.[3]
        : theme.colors.gray?.[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  music: IconMusic,
};

interface TracksGridProps {
  data: { title: string; icon: keyof typeof icons }[];
}

export function TracksGrid({ data }: TracksGridProps) {
  const { classes } = useStyles();
  const stats = data.map((tracks) => {
    const Icon = icons[tracks.icon];

    return (
      <Paper withBorder p="md" radius="md" key={tracks.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {tracks.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}

const ViewCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const { data: composition } = trpc.useQuery(
    [
      "compositions.get",
      {
        id: compositionId ?? "",
      },
    ],
    {
      retry: false,
    }
  );

  const { mutateAsync: acquireCompositionMutation } = trpc.useMutation(
    "usersCompositions.acquire"
  );

  const buyComposition = async () => {
    if (!composition) {
      return alert(
        "No composition found. Try again later or contact the support."
      );
    }
    await acquireCompositionMutation({
      id: composition?.id,
    });
  };

  return (
    <>
      <Head>
        <title>Traken - Previewing {composition?.name ?? "..."}</title>
      </Head>
      <AuthGuard>
        <Container>
          {composition && (
            <>
              <Group>
                <h1>Viewing composition: {composition.name}</h1>
                {composition.currentUserHasAccess && (
                  <Link href={`/play/${composition.id}`}>
                    <Button>Play this composition</Button>
                  </Link>
                )}
                {!composition.currentUserHasAccess && (
                  <button onClick={buyComposition}>Buy this composition</button>
                )}
              </Group>
              <h2>All tracks in composition</h2>
              <TracksGrid
                data={composition.tracks.map((track) => ({
                  title: track.name,
                  icon: "music",
                }))}
              />
            </>
          )}
        </Container>
      </AuthGuard>
    </>
  );
};

export default ViewCompositionPage;
