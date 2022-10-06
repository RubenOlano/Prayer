import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import Navbar from "../../components/NavBar";
import { useRouter } from "next/router";

interface Props {
	session: Session | null;
	inviteId: string;
}

const Invites: NextPage<Props> = ({ session, inviteId }) => {
	const router = useRouter();
	const { data, isLoading } = trpc.useQuery([
		"invites.getGroupFromInvite",
		{ inviteId },
	]);
	const { mutate } = trpc.useMutation("invites.addUserToGroup", {
		onSuccess: () => {
			router.replace("/groups/" + data?.id);
		},
	});

	if (!session) {
		signIn();
	}

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Invites</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Navbar />
				<main>
					<div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
						Loading...
					</div>
				</main>
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Group Pray - Invites</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Navbar />
				<main>
					<div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
						Invite not found
					</div>
				</main>
			</>
		);
	}
	return (
		<>
			<Head>
				<title>Group Pray - Invites</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
			<main>
				<div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
					<h1 className="text-3xl font-bold">
						You have been invited to join{" "}
						<strong className="text-blue-500">{data.name}</strong>
					</h1>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() =>
							mutate({
								inviteId,
								userId: session?.user?.id as string,
							})
						}
					>
						Join Group
					</button>
				</div>
			</main>
		</>
	);
};

export default Invites;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { inviteId } = ctx.query;
	return {
		props: {
			session: await getSession(ctx),
			inviteId,
		},
	};
};
