import { z } from "zod";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const tracksRouter = createRouter() // TODO: use protected router later
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
      console.log("creating track");

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
  });
