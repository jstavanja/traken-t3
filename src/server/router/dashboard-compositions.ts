import { z } from "zod";
import { newCompositionSchema } from "../../utils/validations/compositions";
import { createProtectedRouter } from "./context";

export const dashboardCompositionsRouter = createProtectedRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const user = ctx.session.user;

      const userWithCompositions = await ctx.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          compositions: {
            include: {
              tracks: true,
            },
          },
        },
      });

      return userWithCompositions?.compositions ?? [];
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = ctx.session.user;

      return await ctx.prisma.composition.findFirstOrThrow({
        where: {
          id: input.id,
          User: {
            id: user.id,
          },
        },
        include: {
          tracks: true,
        },
      });
    },
  })
  .mutation("create", {
    input: newCompositionSchema,
    async resolve({ ctx, input }) {
      const user = ctx.session.user;

      await ctx.prisma.composition.create({
        data: {
          name: input.name,
          description: input.description,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return input;
    },
  });
