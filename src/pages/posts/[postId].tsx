import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Comments from "../../components/Comments";
import PostPage from "../../components/PostPage";
import { trpc } from "../../utils/trpc";

interface Props {
	id: string;
	userId: string;
}

const Post: NextPage<Props> = ({ id, userId }) => {
	const { data, isLoading } = trpc.posts.getPost.useQuery({ postId: id, userId });

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Post</title>
					<meta name="description" content="Post" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<div className="flex flex-col items-center justify-center min-h-max py-2 h-max">Loading...</div>
			</>
		);
	}

	if (!data || !data.Group || !data.Group.GroupMembers) {
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
				<title>Group Pray - {data?.title}</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:grid md:grid-cols-2 md:gap-2">
					<div className="md:col-start-1 md:col-end-2 p-3 ">
						<PostPage post={data} />
					</div>
					<div className="md:col-start-2 md:col-end-[-1] p-3">
						<Comments postId={id} userId={userId} />
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
	const params = ctx.params;
	if (!params || !params.postId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {
			id: params.postId,
			userId: session.user.id,
		},
	};
};

export default Post;
