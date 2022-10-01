import {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import CreateGroupForm from "../../components/CreateGroupForm";
import NavBar from "../../components/NavBar";

interface Props {
  user: User;
}

const create: NextPage<Props> = ({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Group Pray Create Group</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="container mx-auto flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl text-center font-bold p-3">Create Group</h1>
        <p className="text-xl text-center ">
          Create a group to pray with your friends
        </p>
        <div className="flex flex-col items-center justify-center p-4">
          <CreateGroupForm user={user} />
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
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
      user: session.user,
    },
  };
};

export default create;
