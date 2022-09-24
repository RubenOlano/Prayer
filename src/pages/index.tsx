import type { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import NavBar from "../components/NavBar";

interface Props {
  user: Session["user"];
}

const Home: NextPage<Props> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Group Pray</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      <main className="container mx-auto flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold">Welcome {user?.name || ""}</h1>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const user = session.user;

  return {
    props: { user },
  };
};
