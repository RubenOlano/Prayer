import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Navbar from "../../../components/NavBar";

interface Props {
  user: User;
  groupId: string;
}

const Admin: NextPage<Props> = ({ user, groupId }) => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "groups.fetchUserIsAdmin",
    { userId: user.id, groupId },
  ]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Group Pray - Admin</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <main>
          <div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
            Loading...
          </div>
        </main>
      </>
    );
  }
  if (!data) {
    router.back();
  }

  return (
    <>
      <Head>
        <title>Group Pray - Admin</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
          Admin
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const groupId = ctx.params?.groupId;
  if (!groupId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
      groupId,
    },
  };
};

export default Admin;
