import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider } from "next-auth/react";
import { FC } from "react";
import { LiteralUnion } from "react-hook-form";
import EmailLogin from "./EmailLogin";
import GoogleSignIn from "./GoogleSignIn";

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

const Login: FC<Props> = ({ providers }) => {
  return (
    <div className="justify-center align-middle backdrop-sepia-10 bg-white/70 pb-12">
      <EmailLogin provider={providers.credentials} />
      <GoogleSignIn provider={providers.google} />
    </div>
  );
};

export default Login;
