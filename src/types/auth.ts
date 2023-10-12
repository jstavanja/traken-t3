import { Role } from '@prisma/client';
import { ReactNode } from 'react';

export interface AuthConfig {
  minimumRole?: Role;
  loading?: ReactNode;
  failRedirectURL?: string;
}
