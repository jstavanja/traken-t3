import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NAVIGATION_ITEMS = [
  {
    title: "Compositions",
    href: "/explore",
  },
  {
    title: "Dashboard",
    href: "/dashboard/compositions",
    if: {
      loggedIn: true,
    },
  },
];

const DefaultHeader = () => {
  const { status } = useSession();
  return (
    <header style={{ display: "flex" }}>
      <Link href="/" passHref>
        <a>Traken</a>
      </Link>
      <nav style={{ display: "flex" }}>
        <ul style={{ display: "flex" }}>
          {NAVIGATION_ITEMS.map((item) => {
            return (
              !(status !== "authenticated" && item.if?.loggedIn) && (
                <li key={item.href}>
                  <Link href={item.href} passHref>
                    <a>{item.title}</a>
                  </Link>
                </li>
              )
            );
          })}
        </ul>
        <span>|</span>
        {status !== "authenticated" && (
          <Link href="/api/auth/signin" passHref>
            <a>Sign in</a>
          </Link>
        )}
        {status === "authenticated" && (
          <button
            onClick={() => {
              signOut();
            }}
          >
            Log out
          </button>
        )}
      </nav>
    </header>
  );
};

export default DefaultHeader;
