// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./user";
import { groupRouter } from "./group";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("users.", userRouter)
  .merge("groups.", groupRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
