import { ClientSafeProvider, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
	provider: ClientSafeProvider;
}

const Auth0: FC<Props> = ({ provider }) => {
	const router = useRouter();
	const callbackUrl = router.query.callbackUrl as string;

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
