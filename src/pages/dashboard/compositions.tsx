import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const CompositionsListPage = () => {
  const { data: compositions } = trpc.useQuery(["userCompositions.getAll"]);
  const { status } = useSession();

  return (
    <div>
      {status !== "authenticated" && (
        <>
          <h1>You are not logged in.</h1>
          <p>
            To see your compositions, log in
            <Link href="/api/auth/signin">
              <button>here!</button>
            </Link>
          </p>
        </>
      )}
      {status === "authenticated" && (
        <>
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
        </>
      )}
    </div>
  );
};

export default CompositionsListPage;
