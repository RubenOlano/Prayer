import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const ProfileEdit = dynamic(() => import("../components/ProfileEdit"));

const Profile = () => {
	return (
		<>
			<Head>
				<title>Group Pray - Profile Edit</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="md:pl-40">
				<ProfileEdit />
			</main>
		</>
	);
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerAuthSession(ctx);
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
