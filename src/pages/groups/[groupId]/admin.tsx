import { User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Navbar from "../../../components/NavBar";
import NavBar from "../../../components/NavBar";
import AdminUserList from "../../../components/AdminUserList";
import AdminPosts from "../../../components/AdminPosts";

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

  const { mutate } = trpc.useMutation("groups.deleteGroup");

  const deleteGroup = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (confirm) {
      mutate({ groupId });
      router.replace("/");
    }
    return;
  };

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
      <NavBar />
      <main>
        <div className="flex flex-row min-w-full p-2">
          <div className="flex flex-col absolute">
            <AdminUserList groupId={groupId} userId={user.id} />
          </div>
          <div className="flex flex-col items-center justify-center py-2 my-0 m-auto">
            <AdminPosts groupId={groupId} />
          </div>
          <div className="flex flex-col absolute right-5 top-30">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.push(`/groups/${groupId}`)}
            >
              Back to Group
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-32 rounded"
              onClick={deleteGroup}
            >
              Delete Group
            </button>
          </div>
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