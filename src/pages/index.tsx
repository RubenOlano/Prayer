import UserPrayerList from "./../components/UserPrayerList";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import GroupList from "../components/GroupList";
import NavBar from "../components/NavBar";
import { User } from "@prisma/client";

interface Props {
  user: User;
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
        <h1 className="text-4xl font-bold">Welcome {user?.fname || ""}</h1>
        <div className="flex p-12 flex-row w-full ">
          <div className="mx-auto w-[25vw]">
            <GroupList user={user} />
          </div>
          <div className="mx-auto w-[25vw]">
            <UserPrayerList user={user} />
          </div>
        </div>
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
