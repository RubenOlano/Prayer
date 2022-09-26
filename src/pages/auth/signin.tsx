import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
} from "next-auth/react";
import Head from "next/head";
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
  return (
    <>
      <Head>
        <title>Prayer App Sign in</title>
      </Head>
      <main>
        <div className="flex justify-center items-center align-middle absolute min-h-full ">
          <EmailForm />
          <Login providers={providers} />
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
