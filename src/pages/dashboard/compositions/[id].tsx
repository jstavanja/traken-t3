import { Composition, Track } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import AuthGuard from "../../../components/AuthGuard";
import AuthError from "../../../components/dashboard/AuthError";
import { trpc } from "../../../utils/trpc";
import { editCompositionSchema } from "../../../utils/validations/compositions";
import { TextInput } from "../../../components/blocks/TextInput";

import {
  editTrackSchema,
  newTrackSchema,
} from "../../../utils/validations/track";
import {
  Button,
  Container,
  FileInput,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Head from "next/head";

interface AddTrackFormProps {
  compositionId: string;
}

interface NewTrackFormValues {
  name: string;
  file?: File;
}

const AddTrackForm: FC<AddTrackFormProps> = ({ compositionId }) => {
  const form = useForm<NewTrackFormValues>({
    validate: zodResolver(newTrackSchema),
    initialValues: {
      name: "",
    },
  });

  const { mutateAsync: newTrackMutation } = trpc.useMutation(
    "tracks.createAndGetFilename"
  );

  const onTrackAddSubmit = form.onSubmit(async (values) => {
    if (!values.file) return;

    const newTrack = await newTrackMutation({
      name: values.name,
      compositionId,
    });

    const formData = new FormData();
    formData.set("file", values.file);

    await fetch(`/api/upload-track?filename=${newTrack.fileName}`, {
      method: "POST",
      body: formData,
    });
  });

  return (
    <form onSubmit={onTrackAddSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Vocals, guitar, ..."
          {...form.getInputProps("name")}
        />
        <FileInput
          accept="audio/mpeg"
          {...form.getInputProps("file")}
          placeholder="File"
        />
        <Button type="submit">Upload track</Button>
      </Stack>
    </form>
  );
};

interface EditCompositionFormProps {
  currentCompositionData: Composition;
}

const EditCompositionForm: FC<EditCompositionFormProps> = ({
  currentCompositionData,
}) => {
  const form = useForm({
    validate: zodResolver(editCompositionSchema),
    initialValues: currentCompositionData,
  });

  const { mutateAsync: editCompositionMutation } = trpc.useMutation(
    "dashboardCompositions.edit"
  );

  const onEditCompositionSubmit = form.onSubmit(async (values) => {
    await editCompositionMutation({
      description: values.description,
      id: currentCompositionData.id,
      name: values.name,
    });
  });

  return (
    <form onSubmit={onEditCompositionSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Cool composition"
          {...form.getInputProps("name")}
        />
        {form.errors.name && <p>{form.errors.name}</p>}
        <TextInput
          label="Description"
          placeholder="Some split tracks for you to jam along."
          {...form.getInputProps("description")}
        />
        {form.errors.description && <p>{form.errors.description}</p>}
        <Button type="submit">Edit composition</Button>
      </Stack>
    </form>
  );
};

interface TracksListProps {
  compositionId: string;
  tracks: Track[];
}

const TracksList: FC<TracksListProps> = ({ compositionId, tracks }) => {
  return (
    <div>
      {tracks.map((track) => (
        <div key={track.id}>
          <EditTrackControls track={track} compositionId={compositionId} />
          <audio controls>
            <source
              src={`${process.env.NEXT_PUBLIC_TRACKS_SERVER}/${track.id}.mp3`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

interface EditTrackControlsProps {
  track: Track;
  compositionId: string;
}

const EditTrackControls: FC<EditTrackControlsProps> = ({
  compositionId,
  track,
}) => {
  const { mutateAsync: deleteTrackMutation } =
    trpc.useMutation("tracks.delete");

  const deleteTrack = async (id: string) => {
    await deleteTrackMutation({
      compositionId,
      id,
    });
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
  track: Track;
  compositionId: string;
}

const EditableTrackName: FC<EditableTrackNameProps> = ({
  track,
  compositionId,
}) => {
  const [editing, setEditing] = useState(false);

  const form = useForm({
    validate: zodResolver(editTrackSchema),
    initialValues: track,
  });

  const { mutateAsync: editTrackMutation } = trpc.useMutation("tracks.edit");

  const onEditTrackSubmit = form.onSubmit(async (values) => {
    await editTrackMutation({
      name: values.name,
      compositionId: compositionId,
      id: track.id,
    });

    setEditing(false);
  });

  if (editing) {
    return (
      <form onSubmit={onEditTrackSubmit}>
        <Group>
          <Group>
            <TextInput
              label="Name"
              placeholder="Vocals, guitar, ..."
              {...form.getInputProps("name")}
            />
            {form.errors.name && <p>{form.errors.name}</p>}
          </Group>
          <Button type="submit">Edit</Button>
        </Group>
      </form>
    );
  }
  return (
    <>
      <h4>{track.name}</h4>
      <Button onClick={() => setEditing(true)}>Edit name</Button>
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
