import { z } from "zod";

export const newTrackSchema = z.object({
  name: z.string(),
});
