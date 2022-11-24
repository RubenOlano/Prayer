import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import GroupList from "../../components/GroupList";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

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
	const session = await getServerAuthSession(context);
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
