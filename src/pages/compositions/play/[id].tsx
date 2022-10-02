import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import AuthGuard from "../../../components/AuthGuard";
import { trpc } from "../../../utils/trpc";

interface FormData {
  activeTracks: Record<string, boolean>;
}

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
    }
  );

  const { register, watch } = useForm<FormData>({
    defaultValues: {
      activeTracks: {},
    },
  });

  const activeTracks = watch("activeTracks");
  const selectedTracks = Object.entries(activeTracks)
    .filter(([, selected]) => {
      return selected;
    })
    .map(([trackId]) => trackId);

  const playSelected = () => {
    selectedTracks.forEach((trackId) => {
      const trackDomElement = document.getElementById(
        `track-${trackId}`
      ) as HTMLAudioElement;
      trackDomElement.play();
    });
  };

  const stopAll = () => {
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.pause();
      audioElement.currentTime = 0.0;
    });
  };

  return (
    <AuthGuard>
      <div>
        {composition && (
          <>
            <h1>Viewing composition: {composition.name}</h1>
            <h2>All tracks in composition</h2>
            <div>
              {composition.tracks?.map((track) => (
                <div key={track.id}>
                  <h4>{track.name}</h4>
                  <label htmlFor={`activate-track-${track.id}`}>
                    Activate song
                  </label>
                  <input
                    type="checkbox"
                    id={`activate-track-${track.id}`}
                    // {...trackFormProps[track.id]}
                    {...register(`activeTracks.${track.id}`)}
                  />
                  <audio controls id={`track-${track.id}`}>
                    <source
                      src={`${process.env.NEXT_PUBLIC_TRACKS_SERVER}/${track.id}.mp3`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
              <button onClick={playSelected}>Play active tracks</button>
              <button onClick={stopAll}>Stop all tracks</button>
            </div>
          </>
        )}
        {error && (
          <p>
            You do not have permissions to view this composition and its tracks.
          </p>
        )}
      </div>
    </AuthGuard>
  );
};

export default ViewCompositionPage;
