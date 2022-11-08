// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import superjson from "superjson";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../db/client";

type CreateContextOptions = {
	session: Session | null;
};

/** Use this helper for:
 * - testing, where we don't have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		prisma,
	};
};

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: trpcNext.CreateNextContextOptions): Promise<Context> => {
	const { req, res } = opts;

	// Get the session from the server using the unstable_getServerSession wrapper function
	const session = await getServerAuthSession({ req, res });

	return await createContextInner({
		session,
	});
};

export const createRouter = () =>
	trpc.initTRPC.context<Context>().create({
		transformer: superjson,
		errorFormatter: ({ shape }) => {
			return shape;
		},
	});

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createProtectedRouter() {
	return createRouter().middleware(({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `session` is non-nullable to downstream resolvers
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});
}
