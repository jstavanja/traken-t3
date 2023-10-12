import { PrismaClient, Role } from '@prisma/client';

export const assertUserHasOneOfRoles = async ({
  prismaClient,
  userId,
  roles,
}: {
  prismaClient: PrismaClient;
  userId: string;
  roles: Role[];
}) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new Error(
      'You are not authorized to create compositions. You must be logged in.'
    );
  }

  if (!roles.includes(user.role)) {
    throw new Error(
      'You are not authorized to create compositions. You must become an author first.'
    );
  }

  return true;
};
