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

	if (!data && !isLoading) {
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
				<meta property="og:title" content="Group Pray" />
				<meta property="og:image:secure_url" content={imgUrl} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="600" />
			</Head>
			<main className="flex flex-col items-center justify-center min-h-max py-2 h-max pb-40 m-10">
				{!isLoading && (
					<div className="text-center card card-normal">
						<div className="card-title">
							<h1>You have been invited to join:</h1>
						</div>
						<div className="card-body">
							<h2 className="text-primary font-extrabold text-2xl">{data.name}</h2>
							{data.description && <h2 className="text-xl">{data.description}</h2>}
							<div className="card-actions justify-center m-2">
								<button
									className="btn btn-primary"
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
						</div>
					</div>
				)}
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
