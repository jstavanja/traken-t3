import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { trackNameValidator } from "../../utils/validations/track";
import { createProtectedRouter } from "./context";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  s3ForcePathStyle: true,
});

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

      const trackUploadInfo = await s3.createPresignedPost({
        Bucket: process.env.S3_BUCKET_NAME,
        Fields: {
          key: `${input.compositionId}/${input.name}`,
          "Content-Type": "audio/mpeg",
        },
        Expires: 60, // seconds
        Conditions: [
          ["content-length-range", 0, 10485760], // up to 10 MB
        ],
      });

      return {
        fileName: track.id,
        trackUploadInfo,
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

      const deletedTrack = await ctx.prisma.track.delete({
        where: {
          id: input.id,
        },
      });
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `${input.compositionId}/${deletedTrack.name}`,
      };

      await s3.deleteObject(deleteParams).promise();
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
