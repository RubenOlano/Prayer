import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import CreatePostForm from "../../components/CreatePostForm";

interface Props {
	user: User;
}

const CreatePost: NextPage<Props> = ({ user }) => {
	return (
		<>
			<Head>
				<title>Create Post</title>
				<meta name="description" content="Create a new post" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className="flex flex-col justify-center py-2">
					<h1 className="text-4xl font-bold text-center m-12">Create Post</h1>
					<div className="justify-center">
						<div className="flex flex-col justify-center">
							<CreatePostForm userId={user.id} />
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default CreatePost;

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
	return {
		props: {
			user: session.user,
		},
	};
};
