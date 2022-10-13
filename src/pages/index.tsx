import UserPrayerList from "./../components/UserPrayerList";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import GroupList from "../components/GroupList";
import NavBar from "../components/NavBar";
import { User } from "next-auth";

interface Props {
	user: User;
}

const Home: NextPage<Props> = ({ user }) => {
	return (
		<>
			<Head>
				<title>Group Pray</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<NavBar />
			<main className="py-3 grid md:grid-cols-6">
				<h1 className="text-2xl md:text-4xl font-bold row-start-1 row-end-2 col-start-3 text-center col-end-5 py-3">
					Welcome {user?.name || ""}
				</h1>
				<div className="col-span-6 grid grid-cols-1 md:grid-cols-6 justify-center">
					<div className="md:col-start-2 md:col-end-4">
						<GroupList userId={user.id} />
					</div>
					<div className="md:col-start-4 md:col-end-6">
						<UserPrayerList userId={user.id} />
					</div>
				</div>
			</main>
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}
	const user = session.user;

	if (!user) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	return {
		props: { user },
	};
};
