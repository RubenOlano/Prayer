/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";
import { compare } from "../../../utils/hash";
import { NextApiRequest, NextApiResponse } from "next";
import { fromDate, generateSessionToken } from "../../../utils/uuid";
import { encode, decode } from "next-auth/jwt";
import Cookies from "cookies";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const options: NextAuthOptions = {
	// Include user.id on session
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
				session.user.name = user.fname + " " + user.lname;
			} else {
				session.user = {
					id: user.id,
					name: user.fname + " " + user.lname,
				};
			}
			return session;
		},
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.fname + " " + user.lname;
			}
			return token;
		},
		async signIn({ user }) {
			if (
				req &&
				req?.query?.nextauth?.includes("callback") &&
				req?.query?.nextauth?.includes("credentials") &&
				req?.method === "POST"
			) {
				if (user) {
					const sessionToken = generateSessionToken();
					const sessionExpiry = fromDate(3600);

					await prisma.user.update({
						where: {
							id: user.id,
						},
						data: {
							sessions: {
								create: {
									sessionToken,
									expires: sessionExpiry,
								},
							},
						},
					});

					const cookies = new Cookies(req, res);

					cookies.set("next-auth.session-token", sessionToken, {
						expires: sessionExpiry,
					});
				}
			}

			return true;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
	adapter: PrismaAdapter(prisma),
	jwt: {
		secret: env.JWT_SECRET,
		async encode({ token, secret, maxAge }) {
			if (
				req?.query?.nextauth?.includes("callback") &&
				req?.query?.nextauth?.includes("credentials") &&
				req.method === "POST"
			) {
				const cookies = new Cookies(req, res);

				const cookie = cookies.get("next-auth.session-token");

				if (cookie) return cookie;
				else return "";
			}
			return encode({ token, secret, maxAge });
		},
		async decode({ token, secret }) {
			if (
				req?.query?.nextauth?.includes("callback") &&
				req.query.nextauth.includes("credentials") &&
				req.method === "POST"
			) {
				return null;
			}

			return decode({ token, secret });
		},
	},
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					access_type: "offline",
					prompt: "consent",
					response_type: "code",
				},
			},
			async profile(profile) {
				return {
					id: profile.sub,
					fname: profile.given_name,
					lname: profile.family_name,
					email: profile.email,
					password: profile.sub,
				};
			},
		}),
		CredentialsProvider({
			name: "Email",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "rolano@example.com",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			authorize: async (credentials) => {
				if (
					!credentials ||
					!credentials.email ||
					!credentials.password
				) {
					return null;
				}
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});
				if (!user) {
					return null;
				}
				const isMatch = await compare(
					credentials.password,
					user.password
				);

				if (!isMatch) {
					return null;
				}
				return {
					...user,
					name: user?.fname + " " + user?.lname,
				};
			},
		}),

		// ...add more providers here
	],
	secret: env.NEXTAUTH_SECRET,
	debug: env.NODE_ENV === "development",
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
	return NextAuth(req, res, {
		// Include user.id on session
		callbacks: {
			session({ session, user }) {
				if (session.user) {
					session.user.id = user.id;
					session.user.name = user.fname + " " + user.lname;
				} else {
					session.user = {
						id: user.id,
						name: user.fname + " " + user.lname,
					};
				}
				return session;
			},
			jwt({ token, user }) {
				if (user) {
					token.id = user.id;
					token.name = user.fname + " " + user.lname;
				}
				return token;
			},
			async signIn({ user }) {
				if (
					req?.query?.nextauth?.includes("callback") &&
					req?.query?.nextauth?.includes("credentials") &&
					req.method === "POST"
				) {
					if (user) {
						const sessionToken = generateSessionToken();
						const sessionExpiry = fromDate(3600);

						await prisma.user.update({
							where: {
								id: user.id,
							},
							data: {
								sessions: {
									create: {
										sessionToken,
										expires: sessionExpiry,
									},
								},
							},
						});

						const cookies = new Cookies(req, res);

						cookies.set("next-auth.session-token", sessionToken, {
							expires: sessionExpiry,
						});
					}
				}

				return true;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
		adapter: PrismaAdapter(prisma),
		jwt: {
			secret: env.JWT_SECRET,
			async encode({ token, secret, maxAge }) {
				if (
					req?.query?.nextauth?.includes("callback") &&
					req?.query?.nextauth?.includes("credentials") &&
					req.method === "POST"
				) {
					const cookies = new Cookies(req, res);

					const cookie = cookies.get("next-auth.session-token");

					if (cookie) return cookie;
					else return "";
				}
				return encode({ token, secret, maxAge });
			},
			async decode({ token, secret }) {
				if (
					req?.query?.nextauth?.includes("callback") &&
					req.query.nextauth.includes("credentials") &&
					req.method === "POST"
				) {
					return null;
				}

				return decode({ token, secret });
			},
		},
		providers: [
			GoogleProvider({
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						access_type: "offline",
						prompt: "consent",
						response_type: "code",
					},
				},
				async profile(profile) {
					return {
						id: profile.sub,
						fname: profile.given_name,
						lname: profile.family_name,
						email: profile.email,
						password: profile.sub,
					};
				},
			}),
			CredentialsProvider({
				name: "Email",
				credentials: {
					email: {
						label: "Email",
						type: "text",
						placeholder: "rolano@example.com",
					},
					password: {
						label: "Password",
						type: "password",
					},
				},
				authorize: async (credentials) => {
					if (
						!credentials ||
						!credentials.email ||
						!credentials.password
					) {
						return null;
					}
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email,
						},
					});
					if (!user) {
						return null;
					}
					const isMatch = await compare(
						credentials.password,
						user.password
					);

					if (!isMatch) {
						return null;
					}
					return {
						...user,
						name: user?.fname + " " + user?.lname,
					};
				},
			}),

			// ...add more providers here
		],
		secret: env.NEXTAUTH_SECRET,
		debug: env.NODE_ENV === "development",
	});
}
