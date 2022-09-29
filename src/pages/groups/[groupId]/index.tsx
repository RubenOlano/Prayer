import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import MemberList from "../../../components/MemberList";
import NavBar from "../../../components/NavBar";
import PrayerSection from "../../../components/PrayerSection";
import { trpc } from "../../../utils/trpc";

const SpecificGroup = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, isLoading } = trpc.useQuery(["groups.getGroup", { id }]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Group Pray - Loading Group</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Group Pray - {data?.name}</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main>
        <div className="flex flex-row min-w-full p-2">
          <div className="flex flex-col absolute">
            <div className="flex flex-col ">
              <h1 className="text-6xl font-bold">{data?.name}</h1>
              <p className="text-2xl">{data?.description}</p>
            </div>
            <div className="flex flex-col items-start justify-start py-2">
              {data?.GroupMembers && (
                <MemberList members={data?.GroupMembers} />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-2 my-0 m-auto">
            <PrayerSection />
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const { groupId } = ctx.query;

  if (!groupId || !session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: groupId,
    },
  };
};

export default SpecificGroup;
