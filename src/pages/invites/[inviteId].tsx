import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

interface Props {
	inviteId: string;
}

const Invites: NextPage<Props> = ({ inviteId }) => {
	const router = useRouter();
	const { data, isLoading } = trpc.invites.getGroupFromInvite.useQuery({ inviteId });
	const { mutate } = trpc.invites.addUserToGroup.useMutation({
		onSuccess: () => {
			router.replace("/groups/" + data?.id);
		},
		onError: e => {
			if (e.data?.code === "CONFLICT") {
				router.replace("/groups/" + data?.id);
			}
		},
	});

	if (!data) {
		return (
			<>
				<Head>
					<title>Group Pray - Invite</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="flex flex-col justify-center items-center">Invite not found</div>
			</>
		);
	}

	const imgUrl = `${getBaseURL()}/api/og?title=${data?.name}&description=${data?.description}`;
	return (
		<>
			<Head>
				<title>Group Pray - Invites</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
				<meta property="og:image" content={imgUrl} />
			</Head>
			<main>
				<div className="flex flex-col items-center justify-center min-h-max py-2 h-max pb-40">
					<h1 className="text-3xl font-bold">
						{!isLoading && (
							<p>
								You have been invited to join <strong className="text-blue-500">{data.name}</strong>
							</p>
						)}
					</h1>
					<button
						className="btn btn-primary mt-4"
						onClick={() =>
							mutate({
								inviteId,
							})
						}
						disabled={isLoading}
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
	const session = await getServerAuthSession(ctx);
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

const getBaseURL = () => {
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	} else {
		return "https://group-pray.vercel.app";
	}
};
