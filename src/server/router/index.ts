// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { tracksRouter } from "./tracks";
import { compositionsRouter } from "./compositions";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tracks.", tracksRouter)
  .merge("compositions.", compositionsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
