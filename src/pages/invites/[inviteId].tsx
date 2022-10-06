import { NextPage } from "next";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import Navbar from "../../components/NavBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface Props {
	session: Session | null;
	inviteId: string;
}

const Invites: NextPage<Props> = () => {
	const { data: session } = useSession();

	const router = useRouter();
	const { inviteId } = router.query;
	const { data, isLoading } = trpc.useQuery([
		"invites.getGroupFromInvite",
		{ inviteId: inviteId as string },
	]);
	const { mutate } = trpc.useMutation("invites.addUserToGroup", {
		onSuccess: () => {
			router.replace("/groups/" + data?.id);
		},
	});

	useEffect(() => {
		if (!session) {
			signIn();
		}
	}, [session]);

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
								inviteId: inviteId as string,
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
