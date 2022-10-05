import { z } from "zod";
import { addURLsToCompositionTracks } from "../../utils/compositions";
import { createProtectedRouter } from "./context";

export const usersCompositions = createProtectedRouter()
  .mutation("acquire", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = ctx.session.user;

      await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          accessibleCompositions: {
            create: {
              assignedBy: "System",
              assignedAt: new Date(),
              composition: {
                connect: {
                  id: input.id,
                },
              },
            },
          },
        },
      });
    },
  })
  .query("getForPlay", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      // check if user can access the tracks
      const compositionThatTheUserCanAccessFully =
        await ctx.prisma.composition.findFirst({
          where: {
            AND: [
              {
                id: input.id,
              },
              {
                OR: [
                  {
                    usersWithAccess: {
                      some: {
                        userId,
                      },
                    },
                  },
                  {
                    User: {
                      id: userId,
                    },
                  },
                ],
              },
            ],
          },
          include: {
            tracks: true,
          },
        });

      if (!compositionThatTheUserCanAccessFully)
        throw new Error(
          "You don't have the permission to access the tracks of this composition"
        );

      return addURLsToCompositionTracks(compositionThatTheUserCanAccessFully);
    },
  });
