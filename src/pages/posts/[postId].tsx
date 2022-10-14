import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Comments from "../../components/Comments";
import NavBar from "../../components/NavBar";
import PostPage from "../../components/PostPage";
import { trpc } from "../../utils/trpc";

interface Props {
	id: string;
	userId: string;
}

const Post: NextPage<Props> = ({ id, userId }) => {
	const { data, isLoading } = trpc.useQuery(["posts.getPost", { postId: id, userId: userId }]);

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Post</title>
					<meta name="description" content="Post" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<NavBar />
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
				<NavBar />
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
			<NavBar />
			<main>
				<div className="grid grid-cols-2 gap-2">
					<div className="col-start-1 col-end-2 p-3 ">
						<PostPage post={data} />
					</div>
					<div className="col-start-2 col-end-[-1] p-3">
						<Comments />
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
