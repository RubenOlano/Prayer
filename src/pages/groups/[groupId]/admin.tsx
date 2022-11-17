import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { trpc } from "../../../utils/trpc";
import AdminUserList from "../../../components/AdminUserList";
import AdminPosts from "../../../components/AdminPosts";
import InviteButton from "../../../components/InviteButton";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";

interface Props {
	groupId: string;
}

const Admin: NextPage<Props> = ({ groupId }) => {
	const router = useRouter();
	const utils = trpc.useContext();
	const { data, isLoading: loadingAdmin } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });
	const { mutate, isLoading } = trpc.groups.deleteGroup.useMutation({
		onSuccess: async () => {
			await utils.groups.getGroups.invalidate();
			router.replace("/");
		},
	});

	const deleteGroup = () => {
		const confirm = window.confirm("Are you sure you want to delete this group?");
		if (confirm) {
			mutate({ groupId });
		}
		return;
	};

	if (loadingAdmin) {
		return (
			<>
				<Head>
					<title>Group Pray - Admin</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="flex flex-col items-center justify-center min-h-max py-2 h-max md:pl-40">
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
					<title>Group Pray - Admin</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="flex flex-col items-center justify-center min-h-max py-2 h-max pl-40">
						You are not an admin of this group
					</div>
				</main>
			</>
		);
	}

	const clickBack = async () => {
		await utils.groups.getGroup.prefetch({ id: groupId });
	};

	return (
		<>
			<Head>
				<title>Group Pray - Admin</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40">
					<div className="flex flex-row md:justify-between align-middle md:max-h-20 p-5">
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded text-sm md:text-base">
							<Link href={`/groups/${groupId}`} onClick={clickBack}>
								Back To Group
							</Link>
						</button>
						<button
							className={`bg-red-500 hover:bg-red-700 text-white font-bold md:py-2 md:px-4 rounded ${
								isLoading ? "opacity-50 cursor-not-allowed" : ""
							}`}
							onClick={deleteGroup}
						>
							Delete Group
						</button>
						<InviteButton groupId={groupId} />
					</div>
					<div className="flex md:flex-row flex-col p-5">
						<div className="md:w-1/4 p-2">
							<AdminUserList />
						</div>
						<div className="md:w-3/4 p-2">
							<AdminPosts groupId={groupId} />
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
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
			session,
			groupId,
		},
	};
};

export default Admin;
