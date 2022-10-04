import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
} from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import EmailForm from "../../components/EmailForm";
import Login from "../../components/Login";

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
        <Image
          src="/background.png"
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="background"
          style={{ zIndex: -1 }}
        />
        <div className="absolute left-[50%] translate-x-[-50%] bottom-0 p-2 md:top-0 md:h-12 z-50">
          <button
            onClick={() => setRegister(!register)}
            className="bg-blue-500 text-white rounded-md p-5 
            hover:bg-blue-600 transition duration-200"
          >
            {register ? "Log in" : "Register"}
          </button>
        </div>
        <div className="justify-center align-middle row-start-2 col-start-2 col-end-4 md:col-start-3 md:col-end-5 z-50">
          {register ? <EmailForm /> : <Login providers={providers} />}
        </div>
      </main>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
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
