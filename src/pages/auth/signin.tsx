import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, getProviders, LiteralUnion } from "next-auth/react";
import Head from "next/head";
import React from "react";
import Login from "../../components/Login";
import { options } from "../api/auth/[...nextauth]";

interface Props {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

const SignIn: NextPage<Props> = ({ providers }) => {
	return (
		<>
			<Head>
				<title>Prayer App Sign in</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col min-h-screen py-5 relative">
				<div className="m-auto">
					<h1 className="md:text-5xl text-2xl font-bold text-center">Welcome to Group Pray</h1>
					<h3 className="md:text-2xl text-xl font-bold text-center">Sign in to get started</h3>
					<div className="md:w-1/3 w-2/3 mx-auto mt-5">
						<Login providers={providers} />
					</div>
				</div>
			</main>
		</>
	);
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	const providers = await getProviders();
	if (session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: { providers, session },
	};
};
