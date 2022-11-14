import { ClientSafeProvider, signIn } from "next-auth/react";
import { FC } from "react";

interface Props {
	searchParams?: { callbackUrl: string };
	provider: ClientSafeProvider;
}

const Auth0: FC<Props> = ({ searchParams, provider }) => {
	const { callbackUrl } = { ...searchParams };
	const onClick = async () => {
		await signIn(provider.id, {
			callbackUrl: callbackUrl || "/",
		});
	};

	return (
		<button className="btn btn-primary btn-lg" onClick={onClick}>
			{provider.name === "Auth0" && "Email Login"}
		</button>
	);
};

export default Auth0;
