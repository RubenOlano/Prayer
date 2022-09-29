// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { userRouter } from "./user";
import { groupRouter } from "./group";
import { postRouter } from "./post";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("users.", userRouter)
  .merge("groups.", groupRouter)
  .merge("posts.", postRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
