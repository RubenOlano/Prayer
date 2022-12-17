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
    <button className="btn btn-primary btn-lg mt-5" onClick={onClick}>
      Sign in with
      <Image
        src="/Google__G__Logo.svg"
        alt="Google Logo"
        width={30}
        height={30}
        className="avatar avatar-sm rounded-full justify-center self-center"
      />
    </button>
  );
};

export default GoogleSignIn;
