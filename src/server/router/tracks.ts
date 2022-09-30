import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const tracksRouter = createRouter() // TODO: use protected router later
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.track.findMany();
    },
  });
