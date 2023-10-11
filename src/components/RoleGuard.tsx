import { Button, Container, Stack, Title } from '@mantine/core';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

const minimumRoleSatisfied = (minimumRole: Role, role: Role) => {
  if (minimumRole === Role.USER) {
    // anyone is a user
    return true;
  }

  if (role === Role.ADMIN) {
    // admins can do anything
    return true;
  }

  if (
    minimumRole === Role.AUTHOR &&
    ([Role.AUTHOR, Role.ADMIN] as string[]).includes(role)
  ) {
    return true;
  }

  return false;
};

interface RoleGuardProps {
  minimumRole: Role;
  CustomError?: FC;
}

const RoleGuard: FC<PropsWithChildren<RoleGuardProps>> = ({
  minimumRole,
  children,
  CustomError,
}) => {
  const { data } = useSession();

  const role = data?.user?.role ?? Role.USER; // falback to user (least privileged)

  if (!minimumRoleSatisfied(minimumRole, role)) {
    if (CustomError) return <CustomError />;
    return null;
  }
  return <>{children}</>;
};

export default RoleGuard;
