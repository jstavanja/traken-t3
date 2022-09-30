import { z } from "zod";
import { newCompositionSchema } from "../../utils/validations/compositions";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const compositionsRouter = createRouter() // TODO: use protected router later
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.composition.findMany({
        include: {
          tracks: true,
        },
      });
    },
  })
  .mutation("create", {
    input: newCompositionSchema,
    async resolve({ ctx, input }) {
      await ctx.prisma.composition.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return input;
    },
  });
