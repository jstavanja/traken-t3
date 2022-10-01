import Link from "next/link";

const AuthError = () => {
  return (
    <>
      <h1>You are not logged in.</h1>
      <p>
        To see your compositions, log in
        <Link href="/api/auth/signin">
          <button>here!</button>
        </Link>
      </p>
    </>
  );
};

export default AuthError;
