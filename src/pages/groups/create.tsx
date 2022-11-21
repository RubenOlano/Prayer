import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import CreateGroupForm from "../../components/CreateGroupForm";
import { options } from "../api/auth/[...nextauth]";

const Create = () => {
	return (
		<>
			<Head>
				<title>Group Pray Create Group</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="md:pl-40 pb-40">
				<div className="m-5">
					<h1 className="text-4xl text-center font-bold p-3">Create Group</h1>
					<p className="text-xl text-center ">Create a group to pray with your friends</p>
					<div className="flex flex-col items-center justify-center p-4">
						<CreateGroupForm />
					</div>
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	if (!session) {
		return {
			redirect: {
				destination: "/auth/signin",
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

export default Create;
