// src/utils/trpc.ts
import type { AppRouter } from "../server/router/_app";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { inferProcedureOutput, inferProcedureInput, inferRouterInputs } from "@trpc/server";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { NextPageContext } from "next";

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export interface SSRContext extends NextPageContext {
	status?: number;
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			links: [
				loggerLink({
					enabled: opts =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({ url }),
			],
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: {
				defaultOptions: {
					queries: {
						staleTime: Infinity,
						optimisticResults: true,
						refetchOnWindowFocus: false,
					},
				},
			},

			// To use SSR properly you need to forward the client's headers to the server
			headers: () => {
				if (ctx?.req) {
					const headers = ctx?.req?.headers;
					delete headers?.connection;
					return {
						...headers,
						"x-ssr": "1",
					};
				}
				return {};
			},
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
});

/**
 * These are helper types to infer the input and output of query resolvers
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
type RouterInputs = inferRouterInputs<AppRouter>;

export type QueryInput<Name extends keyof RouterInputs> = inferProcedureInput<RouterInputs[Name]>;

export type inferMutationOutput<Name extends keyof RouterInputs> = inferProcedureOutput<RouterInputs[Name]>;

export type inferMutationInput<TRouteKey extends keyof RouterInputs> = inferProcedureInput<RouterInputs[TRouteKey]>;
