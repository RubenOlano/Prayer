import { GroupTitle } from "../../../components/GroupTitle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import { unstable_getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";
import SideBar from "../../../components/SideBar";
import PrayerSection from "../../../components/PrayerSection";

interface Props {
	groupId: string;
}

const SpecificGroup: NextPage<Props> = ({ groupId }) => {
	const { data, isLoading } = trpc.groups.getGroup.useQuery({ id: groupId });

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Loading Group</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<SideBar />
				<div className="pl-40">Loading...</div>
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Group Pray - Group Not Found</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<SideBar />
				<div className="flex flex-col items-center justify-center pl-40">Group not found</div>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Group Pray - {data.name}</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<SideBar />
			<main>
				<div className="pl-40 p-5">
					<GroupTitle {...data} groupId={groupId} />
				</div>
				<div className="pl-40 p-5">
					<PrayerSection groupId={groupId} />
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	const params = ctx.params;
	const groupId = params?.groupId as string;
	console.log(groupId);

	if (!groupId || !session || !session.user || !session.user.id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			groupId,
		},
	};
};

export default SpecificGroup;
