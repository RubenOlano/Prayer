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
import styles from "../../styles/login.module.css";

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
        <div className={`${styles.background}`}>
          <div
            className={`flex justify-center align-middle items-center ${styles.backdrop}`}
          >
            <div className="max-w-md pr-12">
              <EmailForm />
            </div>
            <div className="max-w-md pl-12">
              <Login providers={providers} />
            </div>
          </div>
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
