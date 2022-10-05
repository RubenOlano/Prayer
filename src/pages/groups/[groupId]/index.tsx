import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import MemberList from "../../../components/MemberList";
import NavBar from "../../../components/NavBar";
import PrayerSection from "../../../components/PrayerSection";
import { trpc } from "../../../utils/trpc";

const SpecificGroup = ({
	id,
	userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { data, isLoading } = trpc.useQuery(["groups.getGroup", { id }]);
	const { data: isAdmin } = trpc.useQuery([
		"groups.fetchUserIsAdmin",
		{ userId, groupId: id },
	]);

	const goToAdmin = () => {
		router.push(`/groups/${id}/admin`);
	};

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Loading Group</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<NavBar />
				<div>Loading...</div>
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
				<NavBar />
				<div className="flex flex-col items-center justify-center">
					Group not found
				</div>
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
			<NavBar />
			<main>
				<div className="grid grid-cols-4 grid-rows-5 md:grid-cols-8 md:grid-rows-5 md:p-5 p-2 h-[85vh] ">
					<div className="col-start-1 col-end-3 md:col-end-3 row-start-1 row-end-1">
						<h1 className="text-2xl stroke-gray-800 font-bold text-center">
							{data?.name}
						</h1>
						<p className="text-center text-sm text-gray-500">
							{data?.description}
						</p>
					</div>
					<div className="col-start-1 row-start-5 hidden md:block p-2 md:row-start-2 md:row-end-5 md:col-end-3 justify-center">
						{data?.GroupMembers && (
							<MemberList members={data.GroupMembers} />
						)}
					</div>
					<div className="col-start-1 col-end-5 row-end-3 md:col-start-4 md:col-end-8 row-start-2 p-2">
						<PrayerSection />
					</div>
					{isAdmin && (
						<div className="col-start-4 col-end-4 md:col-start-8 md:col-end-8 justify-self-end ">
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								onClick={goToAdmin}
							>
								Edit Group
							</button>
						</div>
					)}
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await getSession(ctx);
	const { groupId } = ctx.query;

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
			id: groupId,
			userId: session.user.id,
		},
	};
};

export default SpecificGroup;
