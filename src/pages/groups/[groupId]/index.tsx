import { GroupTitle } from "../../../components/GroupTitle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import { unstable_getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";
import PrayerSection from "../../../components/PrayerSection";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { createContext } from "../../../server/router/context";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router/_app";
import superjson from "superjson";

interface Props {
	groupId: string;
}

const SpecificGroup: NextPage<Props> = ({ groupId }) => {
	const util = trpc.useContext();

	const { data } = trpc.groups.getGroup.useQuery(
		{ id: groupId },
		{
			onSuccess: async () => {
				await util.groups.fetchUserIsAdmin.prefetch({ groupId });
				await util.posts.getGroupPosts.prefetchInfinite({ groupId });
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

	const ssg = createProxySSGHelpers({
		ctx: await createContext(ctx as unknown as CreateNextContextOptions),
		router: appRouter,
		transformer: superjson,
	});

	await ssg.groups.getGroup.prefetch({ id: groupId });
	await ssg.posts.getGroupPosts.prefetchInfinite({ groupId });
	await ssg.groups.fetchUserIsAdmin.prefetch({ groupId });

	return {
		props: {
			groupId,
			session,
			trpcState: ssg.dehydrate(),
		},
	};
};

export default SpecificGroup;
