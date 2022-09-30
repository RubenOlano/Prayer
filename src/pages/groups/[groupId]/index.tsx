import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import MemberList from "../../../components/MemberList";
import NavBar from "../../../components/NavBar";
import PrayerSection from "../../../components/PrayerSection";
import { trpc } from "../../../utils/trpc";

const SpecificGroup = ({
  id,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery(["groups.getGroup", { id }]);
  const { data: isAdmin } = trpc.useQuery([
    "groups.fetchUserIsAdmin",
    { userId, groupId: id },
  ]);

  const goToAdmin = () => {
    router.push(`/groups/${id}/admin`);
  };

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

  if (!data) {
    return (
      <>
        <Head>
          <title>Group Pray - Group Not Found</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <div className="flex flex-col items-center justify-center">
          Group not found
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Group Pray - {data.name}</title>
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
              {data?.GroupMembers && <MemberList members={data.GroupMembers} />}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-2 my-0 m-auto">
            <PrayerSection />
          </div>
          {isAdmin && (
            <div className="flex flex-col items-center justify-center py-2 my-0 absolute right-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={goToAdmin}
              >
                Edit Group
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const { groupId } = ctx.query;

  if (!groupId || !session || !session.user || !session.user.id) {
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
      userId: session.user.id,
    },
  };
};

export default SpecificGroup;
