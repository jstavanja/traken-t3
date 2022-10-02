import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter, createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const tracksRouter = createProtectedRouter() // TODO: use protected router later
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.track.findMany();
    },
  })
  .mutation("createAndGetFilename", {
    input: z.object({
      name: z.string(),
      compositionId: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (
        !checkIfUserHasPermissionsToTinkerWithComposition(
          ctx.prisma,
          ctx.session.user.id,
          input.compositionId
        )
      ) {
        throw new Error(
          "You are not authorized to add tracks to this composition"
        );
      }

      const track = await ctx.prisma.track.create({
        data: {
          name: input.name,
          Composition: {
            connectOrCreate: {
              where: {
                id: input.compositionId,
              },
              create: {
                description: "New composition",
                name: "New composition",
              },
            },
          },
        },
      });

      console.log("created track");

      return {
        fileName: track.id,
      };
    },
  })
  .mutation("delete", {
    input: z.object({
      compositionId: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (
        !checkIfUserHasPermissionsToTinkerWithComposition(
          ctx.prisma,
          ctx.session.user.id,
          input.compositionId
        )
      ) {
        throw new Error("You are not authorized to alter this composition");
      }
      return await ctx.prisma.track.delete({
        where: {
          id: input.id,
        },
      });
    },
  });

const checkIfUserHasPermissionsToTinkerWithComposition = async (
  prismaClient: PrismaClient,
  userId: string,
  compositionId: string
) => {
  const usersComposition = await prismaClient.composition.findFirst({
    where: {
      id: compositionId,
      User: {
        id: userId,
      },
    },
  });

  return usersComposition !== null;
};
