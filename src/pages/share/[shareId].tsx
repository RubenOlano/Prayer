import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import SharedPostsComp from "../../components/SharedPostsComp";
import { trpc } from "../../utils/trpc";

interface Props {
  shareId: string;
}

const Share: NextPage<Props> = ({ shareId }) => {
  const { data, isLoading } = trpc.shares.getSharedPage.useQuery({ shareId });

  if (!data && !isLoading) {
    return (
      <>
        <Head>
          <title>Group Pray - Shared Posts Not Found</title>
          <meta name="description" content="Pray with company" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center justify-center h-screen">No posts found</div>
      </>
    );
  }

  const imgUrl = `${getBaseURL()}/api/og?title=Prayers&description=${new URLSearchParams(
    "Prayers shared with you"
  ).toString()}`;

  return (
    <>
      <Head>
        <title>Group Pray - Share</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:title" content="Group Pray" />
        <meta property="og:image:secure_url" content={imgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
      </Head>
      <div className="flex flex-col items-center min-h-screen p-3">
        <div className="text-5xl font-bold h-max p-3">Prayers</div>
        <div className="flex flex-col items-center m-5 p-5 backdrop-filter backdrop-blur-md rounded-md overflow-y-scroll">
          {!isLoading &&
            data.nonAnonymousPosts.map(post => (
              <SharedPostsComp key={post.id} content={post.content} name={post.author.name || "Member"} />
            ))}
          {!isLoading &&
            data.anonymousPosts.map(post => <SharedPostsComp key={post.id} content={post.content} name="Anonymous" />)}
        </div>
      </div>
    </>
  );
};

export default Share;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const shareId = ctx.query.shareId as string;

  if (!shareId) return { notFound: true };

  return { props: { shareId } };
};

const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://group-pray.vercel.app";
};
