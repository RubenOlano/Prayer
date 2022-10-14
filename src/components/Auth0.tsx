import { ClientSafeProvider, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
	provider: ClientSafeProvider;
}

const Auth0: FC<Props> = ({ provider }) => {
	const router = useRouter();
	const { callbackUrl } = router.query;
	const onClick = async () => {
		await signIn(provider.id, {
			callbackUrl: (callbackUrl as string) || "/",
		});
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClick}>
				Sign in with {provider.name}
			</button>
		</div>
	);
};

export default Auth0;
