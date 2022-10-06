import { z } from "zod";
import {
  addURLsToCompositionTracks,
  checkIfUserHasPermissionsToTinkerWithComposition,
} from "../../utils/compositions";
import {
  editCompositionSchema,
  newCompositionSchema,
} from "../../utils/validations/compositions";
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

      const composition = await ctx.prisma.composition.findFirstOrThrow({
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

      return addURLsToCompositionTracks(composition);
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
  })
  .mutation("edit", {
    input: editCompositionSchema,
    async resolve({ ctx, input }) {
      if (
        !checkIfUserHasPermissionsToTinkerWithComposition(
          ctx.prisma,
          ctx.session.user.id,
          input.id
        )
      ) {
        throw new Error("You are not authorized to alter this composition");
      }

      return await ctx.prisma.composition.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name ?? undefined,
          description: input.description ?? undefined,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (
        !checkIfUserHasPermissionsToTinkerWithComposition(
          ctx.prisma,
          ctx.session.user.id,
          input.id
        )
      ) {
        throw new Error("You are not authorized to alter this composition");
      }

      return await ctx.prisma.composition.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
