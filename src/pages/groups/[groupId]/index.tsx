import { GroupTitle } from "../../../components/GroupTitle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import { unstable_getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";
import PrayerSection from "../../../components/PrayerSection";
import { useRouter } from "next/router";

interface Props {
	groupId: string;
}

const SpecificGroup: NextPage<Props> = ({ groupId }) => {
	const util = trpc.useContext();
	const router = useRouter();

	const { data } = trpc.groups.getGroup.useQuery(
		{ id: groupId },
		{
			onSuccess: async () => {
				await util.groups.fetchUserIsAdmin.prefetch({ groupId });
				await util.posts.getGroupPosts.prefetchInfinite({ groupId });
			},
			onError: err => {
				if (err.message === "Group not found") {
					router.replace("/");
				}
			},
		}
	);

	return (
		<>
			<Head>
				<title>Group Pray - {data?.name ?? "Loading"}</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40 p-5">
					{data?.name ? <GroupTitle {...data} groupId={groupId} /> : <GroupTitle.Skeleton />}
				</div>
				<div className="md:pl-40 p-5">
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
			session,
		},
	};
};

export default SpecificGroup;
