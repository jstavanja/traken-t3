import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import AuthError from "../../../components/dashboard/AuthError";
import { trpc } from "../../../utils/trpc";

import { Button, Container, Group, Paper, Title } from "@mantine/core";
import Head from "next/head";
import { AddTrackForm } from "../../../components/forms/AddTrackForm";
import { EditCompositionForm } from "../../../components/forms/EditCompositionForm";
import { EditTrackNameForm } from "../../../components/forms/EditTrackNameForm";
import { TrackWithURL } from "../../../types/compositions";

interface TracksListProps {
  compositionId: string;
  tracks: TrackWithURL[];
}

const TracksList: FC<TracksListProps> = ({ compositionId, tracks }) => {
  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id}>
          <EditTrackControls track={track} compositionId={compositionId} />
          <audio controls>
            <source src={track.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

interface EditTrackControlsProps {
  track: TrackWithURL;
  compositionId: string;
}

const EditTrackControls: FC<EditTrackControlsProps> = ({
  compositionId,
  track,
}) => {
  const { mutateAsync: deleteTrackMutation } =
    trpc.useMutation("tracks.delete");

  const utils = trpc.useContext();

  const deleteTrack = async (id: string) => {
    await deleteTrackMutation(
      {
        compositionId,
        id,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries([
            "dashboardCompositions.get",
            {
              id: compositionId,
            },
          ]);
        },
      }
    );
  };
  return (
    <Group>
      <EditableTrackName track={track} compositionId={compositionId} />
      <Button color="red" onClick={() => deleteTrack(track.id)}>
        Delete track
      </Button>
    </Group>
  );
};

interface EditableTrackNameProps {
  track: TrackWithURL;
  compositionId: string;
}

const EditableTrackName: FC<EditableTrackNameProps> = ({
  track,
  compositionId,
}) => {
  const [editing, setEditing] = useState(false);

  const enableEditing = () => {
    setEditing(true);
  };

  const disableEditing = () => {
    setEditing(false);
  };

  if (editing) {
    return (
      <EditTrackNameForm
        track={track}
        compositionId={compositionId}
        onSuccessfulTrackEdit={disableEditing}
      />
    );
  }
  return (
    <>
      <h4>{track.name}</h4>
      <Button onClick={enableEditing}>Edit name</Button>
    </>
  );
};

const EditCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const { data: composition, error } = trpc.useQuery(
    [
      "dashboardCompositions.get",
      {
        id: compositionId ?? "",
      },
    ],
    {
      retry: false,
    }
  );

  return (
    <>
      <Head>
        <title>Traken - Editing {composition?.name ?? "..."}</title>
      </Head>
      <AuthGuard CustomError={AuthError}>
        <Container>
          {error && <h1>Cannot edit composition that is not yours.</h1>}
          {!error && composition && (
            <>
              <Group position="apart">
                <Title>Editing &quot;{composition.name}&quot;</Title>
                <Link href="/dashboard/compositions">
                  <Button>Go back to your compositions</Button>
                </Link>
              </Group>
              <Paper radius="md" p="xl" withBorder mt="xl">
                <h2>Edit description metadata</h2>
                <EditCompositionForm currentCompositionData={composition} />
              </Paper>
              <Paper radius="md" p="xl" withBorder mt="xl">
                <h2>Add a track</h2>
                <AddTrackForm compositionId={compositionId} />
              </Paper>

              <h2>All tracks in composition</h2>
              <TracksList
                compositionId={compositionId}
                tracks={composition.tracks}
              />
            </>
          )}
        </Container>
      </AuthGuard>
    </>
  );
};

export default EditCompositionPage;
