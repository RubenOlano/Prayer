import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import Logo from "../../../public/Google__G__Logo.svg";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

const SignIn: NextPage<Props> = ({ providers }) => {
  return (
    <>
      <Head>
        <title>Prayer App Sign in</title>
      </Head>
      <main>
        <div className="flex flex-col items-center min-h-screen justify-center w-full space-y-10">
          <Image src={Logo} alt="logo" height={50} width={50} />

          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                className="flex items-center justify-center w-64 h-12 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-blue-400 hover:text-white"
              >
                Login with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
