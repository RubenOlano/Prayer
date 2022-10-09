import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { BuiltInProviderType } from "next-auth/providers";
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
} from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import EmailForm from "../../components/EmailForm";
import Login from "../../components/Login";
import { options } from "../api/auth/[...nextauth]";

interface Props {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>;
}

const SignIn: NextPage<Props> = ({ providers }) => {
	const [register, setRegister] = React.useState(true);

	return (
		<>
			<Head>
				<title>Prayer App Sign in</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="min-h-screen py-5 grid md:grid-cols-6 relative">
				<div className="z-[-5]">
					<Image
						src="/background.png"
						layout="fill"
						objectFit="cover"
						quality={100}
						alt="background"
						style={{ zIndex: -5 }}
					/>
				</div>
				<div className="absolute left-[50%] translate-x-[-50%] bottom-0 p-2 md:left-[12vw] md:bottom-[50vh] md:h-12">
					<button
						onClick={() => setRegister(!register)}
						className="bg-blue-500 text-white rounded-md p-5 hover:bg-blue-600 transition duration-200"
					>
						{register ? "Log in" : "Register"}
					</button>
				</div>
				<div className="justify-center align-middle row-start-2 col-start-2 col-end-4 md:col-start-3 md:col-end-5 z-2">
					{register ? <EmailForm /> : <Login providers={providers} />}
				</div>
			</main>
		</>
	);
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);
	const providers = await getProviders();
	if (session) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: { providers },
	};
};
