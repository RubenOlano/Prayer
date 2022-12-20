import { ClientSafeProvider, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  provider: ClientSafeProvider;
}

const Auth0: FC<Props> = ({ provider }) => {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl;

  const onClick = async () => {
    await signIn(provider.id, { callbackUrl: (callbackUrl as string) || "/" });
  };

  return (
    <button className="btn btn-primary btn-outline" onClick={onClick}>
      {provider.name === "Auth0" && "Email Login"}
    </button>
  );
};

export default Auth0;
