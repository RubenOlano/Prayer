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
    <div className="w-full justify-center">
      <EmailLogin provider={providers.credentials} />
      <div className="w-full">
        <p className="text-align">or</p>
      </div>
      <GoogleSignIn provider={providers.google} />
    </div>
  );
};

export default Login;
