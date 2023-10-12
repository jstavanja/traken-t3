import { Role } from '@prisma/client';
import { AuthConfig } from '../types/auth';

export const DASHBOARD_AUTH_CONFIG: AuthConfig = {
  minimumRole: Role.AUTHOR,
};
