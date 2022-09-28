import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

const SpecificGroup = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = trpc.useQuery(["groups.getGroup", { id }]);
  return (
    <>
      <Head>
        <title>Group Pray - {data?.name}</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1>{data?.name}</h1>
          <p>{data?.description}</p>
          {data?.GroupMembers.map((member) => (
            <div key={member.id}>
              <p>{member.User.fname}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { groupId } = ctx.query;

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
      id: groupId,
    },
  };
};

export default SpecificGroup;
