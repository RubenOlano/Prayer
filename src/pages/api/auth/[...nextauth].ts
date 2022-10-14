import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const options: NextAuthOptions = {
	pages: {
		signIn: "/auth/signin",
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		Auth0Provider({
			clientId: env.AUTH0_CLIENT_ID,
			clientSecret: env.AUTH0_CLIENT_SECRET,
			issuer: env.AUTH0_DOMAIN,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
				};
			},
		}),
	],
	callbacks: {
		async session({ session, user }) {
			const res = {
				...session,
				user: {
					...session.user,
					id: user.id,
				},
				userId: user.id,
			};
			return res;
		},
	},
	secret: env.NEXTAUTH_SECRET,
	debug: env.NODE_ENV === "development",
};

export default NextAuth(options);
