import type { GetServerSideProps } from "next";
import Head from "next/head";
import MainFeed from "../components/MainFeed";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

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
					<div className="md:w-[60%] flex justify-center mx-auto">
						<MainFeed />
					</div>
				</div>
			</main>
		</>
	);
};

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
		props: { session },
	};
};

export default Home;
