import { ClientSafeProvider, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
	provider: ClientSafeProvider;
}

const Auth0: FC<Props> = ({ provider }) => {
	const router = useRouter();
	const callbackUrl = (router.query.callbackUrl as string) || "/";
	const onClick = async () => {
		await signIn(provider.id, {
			callbackUrl: callbackUrl,
		});
	};

	return (
		<div className="flex flex-col items-center justify-center p-5">
			<button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
				Sign in with {provider.name}
			</button>
		</div>
	);
};

export default Auth0;
