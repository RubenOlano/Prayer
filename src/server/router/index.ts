// src/server/router/index.ts
import { createProtectedRouter, createRouter } from "./context";

const t = createRouter();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

export const protectedProcedure = t.procedure.use(createProtectedRouter());
