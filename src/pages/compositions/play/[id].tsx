import { useRouter } from "next/router";
import AuthGuard from "../../../components/AuthGuard";
import { trpc } from "../../../utils/trpc";

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
