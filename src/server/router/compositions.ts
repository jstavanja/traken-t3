import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const compositionsRouter = createRouter() // TODO: use protected router later
  .query("getAll", {
    async resolve({ ctx }) {
      const possibleUser = ctx.session?.user;
      console.log({ possibleUser });

      const compositions = await ctx.prisma.composition.findMany({
        include: {
          tracks: {
            select: {
              name: true,
            },
          },
          usersWithAccess: {
            where: {
              userId: possibleUser?.id,
            },
          },
        },
      });

      return compositions.map((composition) => {
        const currentUserHasBeenGrantedAccess =
          composition.usersWithAccess.some(
            (user) => user.userId === possibleUser?.id
          );

        const currentUserIsOwner = composition.userId === possibleUser?.id;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { usersWithAccess, ...compositionPropertiesToServe } =
          composition;

        return {
          ...compositionPropertiesToServe,
          currentUserHasAccess:
            currentUserHasBeenGrantedAccess || currentUserIsOwner,
        };
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const possibleUser = ctx.session?.user;
      const composition = await ctx.prisma.composition.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          tracks: {
            select: {
              name: true,
            },
          },
          usersWithAccess: {
            where: {
              userId: possibleUser?.id,
            },
          },
        },
      });

      const currentUserHasBeenGrantedAccess = composition.usersWithAccess.some(
        (user) => user.userId === possibleUser?.id
      );

      const currentUserIsOwner = composition.userId === possibleUser?.id;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { usersWithAccess, ...compositionPropertiesToServe } = composition;

      return {
        ...compositionPropertiesToServe,
        currentUserHasAccess:
          currentUserHasBeenGrantedAccess || currentUserIsOwner,
      };
    },
  });
