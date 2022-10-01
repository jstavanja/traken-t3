import { useSession } from "next-auth/react";
import Link from "next/link";
import AuthGuard from "../../../components/AuthGuard";
import AuthError from "../../../components/dashboard/AuthError";
import { trpc } from "../../../utils/trpc";

const CompositionsListPage = () => {
  const { data: compositions } = trpc.useQuery([
    "dashboardCompositions.getAll",
  ]);

  return (
    <AuthGuard CustomError={AuthError}>
      <div>
        <h1>Your Compositions</h1>
        <Link href={"/dashboard/compositions/new"}>
          <button>Add new composition</button>
        </Link>
        <ul>
          {compositions?.map((composition) => {
            return (
              <li
                style={{
                  border: "1px solid black",
                }}
                key={composition.id}
              >
                <Link
                  passHref
                  href={`/dashboard/compositions/${composition.id}`}
                >
                  <a>
                    <h3>{composition.name}</h3>
                  </a>
                </Link>
                <p>{composition.description}</p>
                <h4>Tracks in composition:</h4>
                {composition.tracks.map((track) => {
                  return (
                    <ul
                      style={{
                        border: "1px solid black",
                      }}
                      key={track.id}
                    >
                      <li>{track.name}</li>
                    </ul>
                  );
                })}
              </li>
            );
          })}
        </ul>
      </div>
    </AuthGuard>
  );
};

export default CompositionsListPage;
