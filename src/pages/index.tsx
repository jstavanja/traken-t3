import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Welcome to traken</h1>
      {session?.user && (
        <>
          <p>Logged in as {session?.user?.email}</p>
        </>
      )}
      {!session?.user && (
        <Link href="/api/auth/signin">
          <button>Sign in</button>
        </Link>
      )}
    </div>
  );
};

export default Home;
