// src/server/router/index.ts
import { createRouter } from "./context";
import { TRPCError } from "@trpc/server";

const t = createRouter();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

const protectedRouter = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			...ctx,
			// infers that `session` is non-nullable to downstream resolvers
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});

export const protectedProcedure = t.procedure.use(protectedRouter);
