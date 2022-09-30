import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { trpc } from "../../../utils/trpc";

const EditCompositionPage = () => {
  const router = useRouter();
  const compositionId = router.query.id as string;

  const { data: composition } = trpc.useQuery([
    "compositions.get",
    {
      id: compositionId ?? "",
    },
  ]);

  const { mutateAsync: newTrackMutation } = trpc.useMutation(
    "tracks.createAndGetFilename"
  );

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newTrack = await newTrackMutation({
      name: fileName,
      compositionId,
    });

    console.log({ newTrack });

    await fetch(`/api/upload-track?filename=${newTrack.fileName}`, {
      method: "POST",
      body: formData,
    });
  }

  const [fileName, setFileName] = useState("");

  return (
    <div>
      <h1>Edit composition</h1>
      <h2>Add a track</h2>
      <input
        type="text"
        name="name"
        placeholder="Enter the name of the track"
        onChange={(e) => {
          setFileName(e.target.value);
        }}
      />
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/mpeg" name="file" />
        <button type="submit">Upload track</button>
      </form>

      <hr />

      <h2>All tracks in composition</h2>
      {composition?.tracks?.map((track) => (
        <div key={track.id}>
          <h4>{track.name}</h4>
          <audio src={`/tmp/${track.id}.mp3`}></audio>
        </div>
      ))}
    </div>
  );
};

export default EditCompositionPage;
