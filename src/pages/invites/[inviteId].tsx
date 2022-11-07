import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { options } from "../api/auth/[...nextauth]";

interface Props {
	inviteId: string;
}

const Invites: NextPage<Props> = ({ inviteId }) => {
	const router = useRouter();
	const { data, isLoading } = trpc.invites.getGroupFromInvite.useQuery({ inviteId: inviteId as string });
	const { mutate } = trpc.invites.addUserToGroup.useMutation({
		onSuccess: () => {
			router.replace("/groups/" + data?.id);
		},
		onError: async e => {
			if (e.data?.code === "CONFLICT") {
				router.replace("/groups/" + data?.id);
			}
		},
	});
	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Invites</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="flex flex-col items-center justify-center min-h-max py-2 h-max">Loading...</div>
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
			<main>
				<div className="flex flex-col items-center justify-center min-h-max py-2 h-max pb-40">
					<h1 className="text-3xl font-bold">
						You have been invited to join <strong className="text-blue-500">{data.name}</strong>
					</h1>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() =>
							mutate({
								inviteId: inviteId as string,
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

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	const inviteId = ctx.params?.inviteId as string;

	if (!session) {
		return {
			redirect: {
				destination: `/auth/signin?callbackUrl=/invites/${inviteId}`,
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
			inviteId,
		},
	};
};
