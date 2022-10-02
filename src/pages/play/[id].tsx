import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
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
    }
  );

  const playAll = () => {
    document.querySelectorAll("audio").forEach((audioElement) => {
      audioElement.play();
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
                  <audio controls id={`track-${track.id}`}>
                    <source
                      src={`${process.env.NEXT_PUBLIC_TRACKS_SERVER}/${track.id}.mp3`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
              <button onClick={playAll}>Play active tracks</button>
              <button onClick={stopAll}>Stop and reset all tracks</button>
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
