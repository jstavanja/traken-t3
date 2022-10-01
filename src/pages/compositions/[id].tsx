import Link from "next/link";
import { useRouter } from "next/router";
import AuthGuard from "../../components/AuthGuard";
import { trpc } from "../../utils/trpc";

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
    <AuthGuard>
      <div>
        {composition && (
          <>
            <h1>Viewing composition: {composition.name}</h1>
            <h2>All tracks in composition</h2>
            {composition.currentUserHasAccess && (
              <Link href={`/compositions/play/${composition.id}`}>
                <button>Play this composition</button>
              </Link>
            )}
            {!composition.currentUserHasAccess && (
              <button onClick={buyComposition}>Play this composition</button>
            )}
            <div>
              {composition.tracks?.map((track, idx) => (
                <div key={track.name + idx}>
                  <h4>{track.name}</h4>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
};

export default ViewCompositionPage;
