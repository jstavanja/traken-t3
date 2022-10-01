import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../../utils/trpc";

import { newTrackSchema } from "../../../utils/validations/track";

const EditCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const { data: composition, error } = trpc.useQuery(
    [
      "userCompositions.get",
      {
        id: compositionId ?? "",
      },
    ],
    {
      retry: false,
    }
  );

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

  const onSubmit = handleSubmit(async (values) => {
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
    <div>
      {error && <h1>Cannot edit composition that is not yours.</h1>}
      {!error && composition && (
        <>
          <h1>Edit composition: {composition.name}</h1>
          <Link href="/dashboard/compositions">
            <button>Go back to your compositions</button>
          </Link>
          <h2>Add a track</h2>
          <form onSubmit={onSubmit}>
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

          <hr />

          <h2>All tracks in composition</h2>
          <div>
            {composition.tracks?.map((track) => (
              <div key={track.id}>
                <h4>{track.name}</h4>
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
        </>
      )}
    </div>
  );
};

export default EditCompositionPage;
