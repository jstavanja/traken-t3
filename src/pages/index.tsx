import { useSession } from "next-auth/react";
import { WelcomeHero } from "../components/WelcomeHero";

const Home = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user && (
        <>
          <WelcomeHero
            heroText={{
              prefix: "Welcome back, ",
              text: session.user.name ?? "user",
            }}
            actions={[
              {
                text: "Explore compositions",
                href: "/explore",
              },
              {
                color: "gray",
                text: "Create your own compositions",
                href: "/dashboard/compositions",
              },
            ]}
          />
        </>
      )}
      {!session?.user && (
        <WelcomeHero
          heroText={{
            prefix: "Take a track and",
            text: "jam along",
            postfix: "by disabling any instrument!",
          }}
          actions={[
            {
              color: "gray",
              text: "Explore compositions",
              href: "/explore",
            },
            {
              text: "Sign in",
              href: "/api/auth/signin",
            },
          ]}
        />
      )}
    </div>
  );
};

export default Home;
