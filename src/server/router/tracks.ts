import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  editTrackSchema,
  trackNameValidator,
} from "../../utils/validations/track";
import { createProtectedRouter, createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const tracksRouter = createProtectedRouter() // TODO: use protected router later
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

      const deleteFileResult = await fetch(
        `http://localhost:3000/api/delete-track?id=${input.id}`,
        {
          method: "DELETE",
        }
      );

      if (deleteFileResult.status !== 200)
        throw new Error("Could not delete the track files");

      return await ctx.prisma.track.delete({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      name: trackNameValidator,
      compositionId: z.string(), // needed to check whether current user owns composition
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

      return await ctx.prisma.track.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
