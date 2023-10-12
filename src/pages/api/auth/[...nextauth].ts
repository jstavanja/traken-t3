import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      const userInDb = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          role: true,
        },
      });

      if (session.user) {
        session.user.id = user.id;
        session.user.role = userInDb?.role ?? Role.USER;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID as string,
      clientSecret: env.GITHUB_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
