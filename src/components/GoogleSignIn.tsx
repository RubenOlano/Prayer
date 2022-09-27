import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";
import Logo from "../../public/Google__G__Logo.svg";

interface Props {
  provider: ClientSafeProvider;
}

const GoogleSignIn: FC<Props> = ({ provider }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-10">
      <div key={provider.name}>
        <button
          onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          className="flex items-center justify-center w-64 h-12 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-blue-400 hover:text-white"
        >
          <Image src={Logo} alt="logo" height={20} width={20} />
          <p className="p-3">Login with {provider.name}</p>
        </button>
      </div>
    </div>
  );
};

export default GoogleSignIn;
