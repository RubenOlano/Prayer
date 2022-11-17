import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Comments from "../../components/Comments";
import PostPage from "../../components/PostPage";
import { createContext } from "../../server/router/context";
import { appRouter } from "../../server/router/_app";
import { trpc } from "../../utils/trpc";
import { options } from "../api/auth/[...nextauth]";
import superjson from "superjson";

interface Props {
	id: string;
}

const Post: NextPage<Props> = ({ id }) => {
	const util = trpc.useContext();
	const { data, isLoading } = trpc.posts.getPost.useQuery(
		{ postId: id },
		{
			onSuccess: async () => {
				await util.comments.fetchAllComments.prefetch({ postId: id });
				await util.posts.getUserLiked.prefetch({ postId: id });
				await util.posts.getNumberOfLikes.prefetch({ postId: id });
			},
		}
	);

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Loading</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="md:pl-40 m-5 pb-40">
						<div className="md:flex md:justify-between md:m-5">
							<PostPage.Skeleton />
							<Comments.Skeleton />
						</div>
					</div>
				</main>
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Post</title>
					<meta name="description" content="Post" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="flex flex-col justify-center items-center">Post not found</div>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Group Pray - {data.title}</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40 m-5 pb-40">
					<div className="md:flex md:justify-between md:m-5">
						<PostPage {...data} />
						<Comments postId={id} />
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

	const ssg = await createProxySSGHelpers({
		ctx: await createContext(ctx as unknown as CreateNextContextOptions),
		router: appRouter,
		transformer: superjson,
	});
	const params = ctx.params;
	if (!params || !params.postId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	await ssg.posts.getPost.prefetch({ postId: params.postId as string });
	await ssg.comments.fetchAllComments.prefetch({ postId: params.postId as string });
	await ssg.posts.getUserLiked.prefetch({ postId: params.postId as string });
	await ssg.posts.getNumberOfLikes.prefetch({ postId: params.postId as string });

	return {
		props: {
			id: params.postId,
			session,
			trpcState: ssg.dehydrate(),
		},
	};
};

export default Post;
