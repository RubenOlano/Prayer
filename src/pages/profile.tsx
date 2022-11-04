import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import ProfileEdit from "../components/ProfileEdit";
import SideBar from "../components/SideBar";
import { trpc } from "../utils/trpc";
import { options } from "./api/auth/[...nextauth]";

const Profile = () => {
	const { data: session } = useSession();
	if (!session) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-2xl font-bold">You are not signed in</h1>
				<h1 className="text-xl font-bold">Please sign in to view your prayers</h1>
			</div>
		);
	}
	const { user } = session;
	const { data, isLoading } = trpc.users.getUser.useQuery({ id: user?.id as string });

	if (isLoading)
		return (
			<>
				<Head>
					<title>Profile - Loading...</title>
					<meta name="description" content="Loading..." />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="p-5 md:grid md:grid-cols-3">Loading...</div>
			</>
		);

	if (!data && !isLoading) {
		return (
			<>
				<Head>
					<title>Profile - Error</title>
					<meta name="description" content="Error" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="p-5 md:grid md:grid-cols-3">Error</div>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Prayer App Profile</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<SideBar />
			<main className="p-5 md:grid md:grid-cols-3 ">
				<ProfileEdit user={{ ...data, image: data.image || undefined }} />
			</main>
		</>
	);
};

export default Profile;

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
