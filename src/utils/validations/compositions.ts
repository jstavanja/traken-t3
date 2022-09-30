import { z } from "zod";

export const newCompositionSchema = z.object({
  name: z.string().min(1, "Your composition must have a name."),
  description: z
    .string()
    .min(1, "Your composition must have a quick description."),
});

export const editCompositionSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
});
