// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedUsersRouter } from "./users";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("users.", protectedUsersRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
