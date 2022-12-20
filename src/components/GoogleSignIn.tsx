import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  provider: ClientSafeProvider;
}

const GoogleSignIn: FC<Props> = ({ provider }) => {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl as string;
  const onClick = async () => await signIn(provider.id, { callbackUrl });

  return (
    <button className="btn btn-primary btn-outline" onClick={onClick}>
      Sign in with
      <Image
        src="/Google__G__Logo.svg"
        alt="Google Logo"
        width={20}
        height={20}
        className="avatar avatar-sm rounded-full justify-center self-center pl-2"
      />
    </button>
  );
};

export default GoogleSignIn;
