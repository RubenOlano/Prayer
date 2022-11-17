import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import ProfileEdit from "../components/ProfileEdit";
import { createContext } from "../server/router/context";
import { appRouter } from "../server/router/_app";
import { options } from "./api/auth/[...nextauth]";
import superjson from "superjson";

const Profile = () => {
	return (
		<>
			<Head>
				<title>Group Pray - Profile Edit</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="md:pl-40">
				<ProfileEdit />
			</main>
		</>
	);
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		};
	}

	const ssg = createProxySSGHelpers({
		ctx: await createContext(ctx as unknown as CreateNextContextOptions),
		router: appRouter,
		transformer: superjson,
	});

	await ssg.users.getUser.prefetch({ id: session.user.id });

	return {
		props: { session, trpcState: ssg.dehydrate() },
	};
};
