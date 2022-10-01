import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return (
      <div>
        <p>You must be logged in in order to view this page.</p>
        <p>
          Log in:
          <Link href="/api/auth/signin">
            <button>here</button>
          </Link>
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGuard;
