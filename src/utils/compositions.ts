import { Composition, PrismaClient, Track } from "@prisma/client";
import S3 from "aws-sdk/clients/s3";
import {
  CompositionWithTracksThatHaveURLs,
  TrackWithURL,
} from "../types/compositions";

export const addURLsToCompositionTracks = async (
  composition: Composition & {
    tracks: Track[];
  }
) => {
  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    s3ForcePathStyle: true,
  });

  const tracks: TrackWithURL[] = await Promise.all(
    composition.tracks.map(async (track) => {
      return {
        ...track,
        url: await s3.getSignedUrlPromise("getObject", {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${composition.id}/${track.name}`,
        }),
      };
    })
  );

  const compositionWithTracksThatHaveURLs = composition;
  compositionWithTracksThatHaveURLs.tracks = tracks;

  return compositionWithTracksThatHaveURLs as CompositionWithTracksThatHaveURLs;
};

export const checkIfUserHasPermissionsToTinkerWithComposition = async (
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
