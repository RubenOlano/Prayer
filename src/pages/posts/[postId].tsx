import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Comments from "../../components/Comments";
import PostPage from "../../components/PostPage";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

interface Props {
	id: string;
}

const Post: NextPage<Props> = ({ id }) => {
	const { data, isLoading } = trpc.posts.getPost.useQuery({ postId: id });

	return (
		<>
			<Head>
				<title>Group Pray - {isLoading ? "Loading" : data?.title}</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="md:pl-40 m-5 pb-40 md:pb-0 md:flex">
					<div className="md:flex m-5 md:w-1/2 ">
						<PostPage />
					</div>
					<div className="md:flex m-5 p-3 md:w-1/2">
						<Comments postId={id} />
					</div>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerAuthSession(ctx);
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
			session,
		},
	};
};

export default Post;
