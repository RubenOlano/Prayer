import { GetServerSideProps } from "next";
import Head from "next/head";
import ExploreHeader from "../components/ExploreHeader";
import GroupExploreFeed from "../components/GroupExploreFeed";
import { getServerAuthSession } from "../server/common/get-server-auth-session";

const Explore = () => {
  return (
    <>
      <Head>
        <title>Group Pray - Explore</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:pl-40 align-center justify-center pb-40">
        <ExploreHeader />
        <GroupExploreFeed />
      </main>
    </>
  );
};

export default Explore;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx);
  if (!session || !session.user) return { redirect: { destination: "/auth/signin", permanent: false } };

  return { props: { session } };
};
