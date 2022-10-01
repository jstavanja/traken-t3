// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { tracksRouter } from "./tracks";
import { compositionsRouter } from "./compositions";
import { dashboardCompositionsRouter } from "./dashboard-compositions";
import { usersCompositions } from "./users-compositions";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("tracks.", tracksRouter)
  .merge("compositions.", compositionsRouter)
  .merge("dashboardCompositions.", dashboardCompositionsRouter)
  .merge("usersCompositions.", usersCompositions);

// export type definition of API
export type AppRouter = typeof appRouter;
