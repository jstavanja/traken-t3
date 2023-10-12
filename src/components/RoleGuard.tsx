import { Button, Container, Stack, Title } from '@mantine/core';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';
import { minimumRoleSatisfied } from '../utils/roles';

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
