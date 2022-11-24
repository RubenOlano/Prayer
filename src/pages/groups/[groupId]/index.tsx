import { GroupTitle } from "../../../components/GroupTitle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import PrayerSection from "../../../components/PrayerSection";
import { useRouter } from "next/router";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

interface Props {
	groupId: string;
}

const SpecificGroup: NextPage<Props> = ({ groupId }) => {
	const router = useRouter();

	const { data } = trpc.groups.getGroup.useQuery(
		{ id: groupId },
		{
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
					<GroupTitle />
				</div>
				<div className="md:pl-40 p-5">
					<PrayerSection />
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerAuthSession(ctx);
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
