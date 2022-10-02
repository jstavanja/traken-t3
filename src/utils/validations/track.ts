import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = ["audio/mpeg"];

export const trackNameValidator = z.string().min(1, "Track name is required");

export const newTrackSchema = z.object({
  name: trackNameValidator,
  file: z
    .any()
    .refine((files) => files?.length == 1, "Track file is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 10MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".mp3 files are accepted."
    ),
});

export const editTrackSchema = z.object({
  name: trackNameValidator,
});
