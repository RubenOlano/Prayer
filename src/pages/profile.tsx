import { GetServerSideProps } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";
import NavBar from "../components/NavBar";
import ProfileEdit from "../components/ProfileEdit";
import { trpc } from "../utils/trpc";

interface Props {
	user: User;
}

const Profile: FC<Props> = ({ user }) => {
	const router = useRouter();
	const { data, isLoading } = trpc.useQuery(["users.getUser", { id: user.id }]);

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
		router.replace("/auth/signin");
		return <div>Redirecting...</div>;
	}

	return (
		<>
			<Head>
				<title>Prayer App Profile</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<main className="p-5 md:grid md:grid-cols-3 ">
				<ProfileEdit user={{ ...data, image: data.image || undefined }} />
			</main>
		</>
	);
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getSession(ctx);
	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	return {
		props: { user: session.user },
	};
};
