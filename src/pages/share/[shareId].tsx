import Head from "next/head";
import { useRouter } from "next/router";
import SharedPostsComp from "../../components/SharedPostsComp";
import { trpc } from "../../utils/trpc";

const Share = () => {
	const router = useRouter();
	const { shareId } = router.query;

	const { data, isLoading } = trpc.useQuery(["share.getSharePage", { shareId: shareId as string }]);

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Loading Shared Posts</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="flex flex-col items-center justify-center h-screen">Loading posts...</div>
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Group Pray - Shared Posts Not Found</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="flex flex-col items-center justify-center h-screen">No posts found</div>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Group Pray - Share</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col items-center min-h-screen p-3">
				<div className="text-5xl font-bold h-max p-3">Prayers</div>
				<div className="flex flex-col items-center m-5 p-5 backdrop-sepia-0 bg-white/60 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-md overflow-y-scroll">
					{data.nonAnonymousPosts.map(post => (
						<SharedPostsComp key={post.id} content={post.content} name={post.author.name || "Member"} />
					))}
					{data.anonymousPosts.map(post => (
						<SharedPostsComp key={post.id} content={post.content} name="Anonymous" />
					))}
				</div>
			</div>
		</>
	);
};

export default Share;
