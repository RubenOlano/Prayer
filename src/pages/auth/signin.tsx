import { GetServerSideProps, NextPage } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, getProviders, LiteralUnion } from "next-auth/react";
import Head from "next/head";
import Login from "../../components/Login";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

interface Props {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

const SignIn: NextPage<Props> = ({ providers }) => {
  const imgUrl = `${getBaseURL()}/api/og?title=Group%20Pray&description=Sign%20in%20to%20Group%20Pray`;
  return (
    <>
      <Head>
        <title>Prayer App Sign in</title>
        <meta name="description" content="Pray with company" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={imgUrl} />
        <meta property="og:title" content="Group Pray" />
        <meta property="og:image:secure_url" content={imgUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <div className="flex flex-col items-center justify-center p-8 bg-base-300 rounded-lg shadow-lg">
          <h1 className="text-3xl pb-3 text-center text-base-content">Welcome to Group Pray</h1>
          <h3 className="text-2xl pb-2 text-center text-base-content">Sign in to get started</h3>
          <div className="flex">
            <Login providers={providers} />
          </div>
        </div>
      </main>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerAuthSession(ctx);
  const providers = await getProviders();

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { providers, session },
  };
};

const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://group-pray.vercel.app";
};
