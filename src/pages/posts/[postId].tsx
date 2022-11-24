import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

const PostPage = dynamic(() => import("../../components/PostPage"));
const Comments = dynamic(() => import("../../components/Comments"));

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
				<div className="md:pl-40 m-5 pb-40 md:flex">
					<div className="md:flex m-5 h-96 md:w-1/2 ">
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
