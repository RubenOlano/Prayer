import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Session, unstable_getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]";
import MainFeed from "../components/MainFeed";

const Home = () => {
	return (
		<>
			<Head>
				<title>Group Pray</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="pl-40">
					<MainFeed />
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<{ session: Session }> = async context => {
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
		props: { session },
	};
};

export default Home;
