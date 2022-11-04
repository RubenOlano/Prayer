import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { trpc } from "../../../utils/trpc";
import AdminUserList from "../../../components/AdminUserList";
import AdminPosts from "../../../components/AdminPosts";
import InviteButton from "../../../components/InviteButton";
import Link from "next/link";

interface Props {
	user: User;
	groupId: string;
}

const Admin: NextPage<Props> = ({ user, groupId }) => {
	const router = useRouter();
	const utils = trpc.useContext();
	const { data, isLoading } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });

	const { mutate } = trpc.groups.deleteGroup.useMutation({
		onSuccess: async () => {
			await utils.groups.getGroups.invalidate();
			router.push("/");
		},
	});

	const deleteGroup = async () => {
		const confirm = window.confirm("Are you sure you want to delete this group?");
		if (confirm) {
			await mutate({ groupId });
		}
		return;
	};

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Admin</title>
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
		router.back();
	}

	return (
		<>
			<Head>
				<title>Group Pray - Admin</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:grid grid-rows-2 md:grid-cols-4 p-3">
					<div className="md:col-start-1 md:col-end-2 col-start-1 col-end-1">
						<AdminUserList groupId={groupId} userId={user.id} />
					</div>
					<div className="md:col-start-2 md:col-end-4">
						<AdminPosts groupId={groupId} />
					</div>
					<div className="md:col-start-4 md:col-end-5 p-4 md:row-start-1 md:row-end-2">
						<Link
							href={`/groups/${groupId}`}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Back to Group
						</Link>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 md:mt-32 rounded"
							onClick={deleteGroup}
						>
							Delete Group
						</button>
					</div>
					<div className="md:col-start-4 md-col-end-5 p-4 md:row-start-2 md:row-end-2">
						<InviteButton groupId={groupId} userId={user.id} />
					</div>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getSession(ctx);
	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const groupId = ctx.params?.groupId;
	if (!groupId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: session.user,
			groupId,
		},
	};
};

export default Admin;
