import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_TRACK_FILE_TYPES = ["audio/mpeg"];

export const trackNameValidator = z.string().min(1, "Track name is required");

export const newTrackSchema = z.object({
  name: trackNameValidator,
  file: z
    .any()
    .refine((file) => file?.size > 0, "Provide a non-empty file.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (file) => ACCEPTED_TRACK_FILE_TYPES.includes(file?.type),
      "Only .mp3 files are accepted."
    ),
});

export const editTrackSchema = z.object({
  name: trackNameValidator,
});
