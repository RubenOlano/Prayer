import AdminHeader from "./../../../../components/AdminHeader";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../../../utils/trpc";
import EditGroupForm from "../../../../components/EditGroupForm";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";

interface Props {
  groupId: string;
}

const Admin: NextPage<Props> = ({ groupId }) => {
  const { data, isLoading: loadingAdmin } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });

  if (loadingAdmin) {
    return (
      <>
        <Head>
          <title>Group Pray - Admin</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="md:pl-40 pb-20">
          <AdminHeader.Skeleton />
          <div className="md:flex"></div>
        </main>
      </>
    );
  }
  if (!data) {
    return (
      <>
        <Head>
          <title>Group Pray - Admin</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className="flex flex-col items-center justify-center min-h-max py-2 h-max md:pl-40">
            You are not an admin of this group
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Group Pray - Admin</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:pl-40 pb-20">
        <AdminHeader groupId={groupId} />
        <div className="md:flex">
          <EditGroupForm />
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx);
  if (!session || !session.user) return { redirect: { destination: "/", permanent: false } };

  const groupId = ctx.params?.groupId;
  if (!groupId) return { redirect: { destination: "/", permanent: false } };

  return { props: { session, groupId } };
};

export default Admin;
