import type { GetServerSideProps } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]";
import MainFeed from "../components/MainFeed";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createContext } from "../server/router/context";
import { appRouter } from "../server/router/_app";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";

const Home = () => {
	return (
		<>
			<Head>
				<title>Group Pray</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40 pb-40">
					<MainFeed />
				</div>
			</main>
		</>
	);
};

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

	const ssg = createProxySSGHelpers({
		ctx: await createContext(context as unknown as CreateNextContextOptions),
		router: appRouter,
		transformer: superjson,
	});

	await ssg.posts.getPostFeed.prefetchInfinite({
		limit: 5,
	});

	return {
		props: { session, trpcState: ssg.dehydrate() },
	};
};

export default Home;
