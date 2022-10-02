import { useSession } from "next-auth/react";
import { WelcomeHero } from "../components/WelcomeHero";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user && (
        <>
          <p>Logged in as {session?.user?.email}</p>
        </>
      )}
      {!session?.user && <WelcomeHero />}
    </div>
  );
};

export default Home;
