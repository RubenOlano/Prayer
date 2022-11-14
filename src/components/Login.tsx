import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider } from "next-auth/react";
import { FC } from "react";
import { LiteralUnion } from "react-hook-form";
import Auth0 from "./Auth0";
import GoogleSignIn from "./GoogleSignIn";

interface Props {
	providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
}

const Login: FC<Props> = ({ providers }) => {
	return (
		<div className="flex flex-col items-center justify-center btn-group btn-group-vertical">
			<Auth0 provider={providers.auth0} />
			<GoogleSignIn provider={providers.google} />
		</div>
	);
};

export default Login;
