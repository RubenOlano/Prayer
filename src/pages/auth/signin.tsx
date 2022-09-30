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
import styles from "../../styles/login.module.css";
import { env } from "../../env/server.mjs";
interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

const SignIn: NextPage<Props> = ({ providers }) => {
  console.log(env);

  return (
    <>
      <Head>
        <title>Prayer App Sign in</title>
      </Head>
      <main className="w-full h-full relative">
        <Image
          src="/background.png "
          alt="background"
          layout="fill"
          objectFit="cover"
          objectPosition={"center"}
          className={styles.background}
          quality={100}
        />
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
