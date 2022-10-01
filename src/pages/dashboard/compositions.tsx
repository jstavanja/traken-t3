import Link from "next/link";
import { trpc } from "../../utils/trpc";

const CompositionsListPage = () => {
  const { data: compositions } = trpc.useQuery(["compositions.getAll"]);

  return (
    <div>
      <h1>Your Compositions</h1>
      <ul>
        {compositions?.map((composition) => {
          return (
            <li
              style={{
                border: "1px solid black",
              }}
              key={composition.id}
            >
              <Link passHref href={`/dashboard/compositions/${composition.id}`}>
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
  );
};

export default CompositionsListPage;
