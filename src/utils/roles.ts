import { Role } from '@prisma/client';

export const minimumRoleSatisfied = (minimumRole: Role, role: Role) => {
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
