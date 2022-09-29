import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import PostPage from "../../components/PostPage";
import { trpc } from "../../utils/trpc";

interface Props {
  id: string;
  userId: string;
}

const Post: NextPage<Props> = ({ id, userId }) => {
  const { data, isLoading } = trpc.useQuery([
    "posts.getPost",
    { postId: id, userId: userId },
  ]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Post</title>
          <meta name="description" content="Post" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <div>Loading...</div>
      </>
    );
  }

  if (!data || !data.Group || !data.Group.GroupMembers) {
    return (
      <>
        <Head>
          <title>Post</title>
          <meta name="description" content="Post" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <div className="flex flex-col justify-center items-center">
          Post not found
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Group Pray - {data?.title}</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main>
        <div className="flex flex-col items-center justify-center min-h-max py-2 h-max">
          <PostPage post={data} />
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
  const params = ctx.params;
  if (!params || !params.postId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  console.log(params.postId);
  return {
    props: {
      id: params.postId,
      userId: session.user.id,
    },
  };
};

export default Post;
