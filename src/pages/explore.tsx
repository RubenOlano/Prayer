import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import ExploreHeader from "../components/ExploreHeader";
import GroupExploreFeed from "../components/GroupExploreFeed";
import { options } from "./api/auth/[...nextauth]";

const Explore = () => {
	return (
		<>
			<Head>
				<title>Group Pray - Explore</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="md:pl-40 align-center justify-center pb-40">
				<ExploreHeader />
				<GroupExploreFeed />
			</main>
		</>
	);
};

export default Explore;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
};
