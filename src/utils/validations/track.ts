import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["audio/mpeg"];

export const newTrackSchema = z.object({
  name: z.string().min(1, "Track name is required"),
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
