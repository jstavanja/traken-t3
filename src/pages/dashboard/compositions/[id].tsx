import { zodResolver } from "@hookform/resolvers/zod";
import { Composition, Track } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthGuard from "../../../components/AuthGuard";
import AuthError from "../../../components/dashboard/AuthError";
import { trpc } from "../../../utils/trpc";
import { editCompositionSchema } from "../../../utils/validations/compositions";

import {
  editTrackSchema,
  newTrackSchema,
} from "../../../utils/validations/track";

interface AddTrackFormProps {
  compositionId: string;
}

const AddTrackForm: FC<AddTrackFormProps> = ({ compositionId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof newTrackSchema>>({
    resolver: zodResolver(newTrackSchema),
  });

  const { mutateAsync: newTrackMutation } = trpc.useMutation(
    "tracks.createAndGetFilename"
  );

  const onTrackAddSubmit = handleSubmit(async (values) => {
    const newTrack = await newTrackMutation({
      name: values.name,
      compositionId,
    });

    const formData = new FormData();
    formData.set("file", values.file[0]);

    await fetch(`/api/upload-track?filename=${newTrack.fileName}`, {
      method: "POST",
      body: formData,
    });
  });

  return (
    <form onSubmit={onTrackAddSubmit}>
      <input
        type="text"
        {...register("name")}
        placeholder="Enter the name of the track"
      />
      {errors.name && <p>{errors.name?.message}</p>}
      <input type="file" accept="audio/mpeg" {...register("file")} />
      {errors.file && <p>{String(errors.file?.message)}</p>}
      <button type="submit">Upload track</button>
    </form>
  );
};

interface EditCompositionFormProps {
  currentCompositionData: Composition;
}

const EditCompositionForm: FC<EditCompositionFormProps> = ({
  currentCompositionData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof editCompositionSchema>>({
    resolver: zodResolver(editCompositionSchema),
    defaultValues: currentCompositionData,
  });

  const { mutateAsync: editCompositionMutation } = trpc.useMutation(
    "dashboardCompositions.edit"
  );

  const onEditCompositionSubmit = handleSubmit(async (values) => {
    await editCompositionMutation({
      description: values.description,
      id: currentCompositionData.id,
      name: values.name,
    });
  });

  return (
    <form onSubmit={onEditCompositionSubmit}>
      <label htmlFor="name">Composition name</label>
      <input
        type="text"
        id="name"
        {...register("name")}
        placeholder="Enter the name of the composition"
      />
      {errors.name && <p>{errors.name?.message}</p>}
      <label htmlFor="description">Composition description</label>
      <input
        type="text"
        id="description"
        {...register("description")}
        placeholder="Enter the description of the composition"
      />
      {errors.name && <p>{errors.description?.message}</p>}
      <button type="submit">Edit composition</button>
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
    <div
      style={{
        display: "flex",
      }}
    >
      <EditableTrackName track={track} compositionId={compositionId} />
      <button onClick={() => deleteTrack(track.id)}>Delete track</button>
    </div>
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof editTrackSchema>>({
    resolver: zodResolver(editTrackSchema),
    defaultValues: track,
  });

  const { mutateAsync: editTrackMutation } = trpc.useMutation("tracks.edit");

  const onEditTrackSubmit = handleSubmit(async (values) => {
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
        <input type="text" {...register("name")} />
        {errors.name && <p>{errors.name?.message}</p>}
        <button type="submit">Edit</button>
      </form>
    );
  }
  return (
    <>
      <h4>{track.name}</h4>
      <button onClick={() => setEditing(true)}>Edit name</button>
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
    <AuthGuard CustomError={AuthError}>
      <div>
        {error && <h1>Cannot edit composition that is not yours.</h1>}
        {!error && composition && (
          <>
            <h1>Editing composition: {composition.name}</h1>
            <Link href="/dashboard/compositions">
              <button>Go back to your compositions</button>
            </Link>
            <h2>Edit description metadata</h2>
            <EditCompositionForm currentCompositionData={composition} />
            <h2>Add a track</h2>
            <AddTrackForm compositionId={compositionId} />
            <hr />

            <h2>All tracks in composition</h2>
            <TracksList
              compositionId={compositionId}
              tracks={composition.tracks}
            />
          </>
        )}
      </div>
    </AuthGuard>
  );
};

export default EditCompositionPage;
