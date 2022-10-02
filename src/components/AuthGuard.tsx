import { Button, Container, Stack, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

interface AuthGuardProps {
  CustomError?: FC;
}

const AuthGuard: FC<PropsWithChildren<AuthGuardProps>> = ({
  children,
  CustomError,
}) => {
  const { status } = useSession();
  if (status === "unauthenticated") {
    if (CustomError) return <CustomError />;
    return (
      <Container>
        <Stack>
          <Title>You must be logged in in order to view this page.</Title>
          <Link href="/api/auth/signin">
            <Button>Log in here</Button>
          </Link>
        </Stack>
      </Container>
    );
  }
  return <>{children}</>;
};

export default AuthGuard;
