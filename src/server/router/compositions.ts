import { z } from "zod";
import { newCompositionSchema } from "../../utils/validations/compositions";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const compositionsRouter = createRouter() // TODO: use protected router later
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.composition.findMany({
        include: {
          tracks: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.composition.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          tracks: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  });
