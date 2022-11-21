import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import CreatePostForm from "../../components/CreatePostForm";
import { options } from "../api/auth/[...nextauth]";

const CreatePost = () => {
	return (
		<>
			<Head>
				<title>Create Post</title>
				<meta name="description" content="Create a new post" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="md:pl-40 mb-40">
				<div className="m-5">
					<h1 className="text-4xl font-bold text-center m-12">Create Post</h1>
					<CreatePostForm />
				</div>
			</main>
		</>
	);
};

export default CreatePost;

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
	return {
		props: {
			session,
		},
	};
};
