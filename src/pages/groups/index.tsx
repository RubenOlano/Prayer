import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import React from "react";
import GroupList from "../../components/GroupList";
import { options } from "../api/auth/[...nextauth]";

const Groups = () => {
	return (
		<>
			<Head>
				<title>Group Pray - Groups</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="pl-40 align-center justify-center">
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
	return {
		props: {
			session,
		},
	};
};
