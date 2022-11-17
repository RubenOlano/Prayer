import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import React from "react";
import GroupList from "../../components/GroupList";
import { createContext } from "../../server/router/context";
import { appRouter } from "../../server/router/_app";
import { options } from "../api/auth/[...nextauth]";
import superjson from "superjson";

const Groups = () => {
	return (
		<>
			<Head>
				<title>Group Pray - Groups</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40 align-center justify-center pb-40">
					<GroupList />
				</div>
			</main>
		</>
	);
};

export default Groups;

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await unstable_getServerSession(context.req, context.res, options);
	if (!session) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	const ssg = await createProxySSGHelpers({
		ctx: await createContext(context as unknown as CreateNextContextOptions),
		router: appRouter,
		transformer: superjson,
	});

	ssg.groups.getGroups.prefetch();

	return {
		props: {
			session,
			trpcState: ssg.dehydrate(),
		},
	};
};
