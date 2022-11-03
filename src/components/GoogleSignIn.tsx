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
	const onClick = async () => {
		await signIn(provider.id, {
			callbackUrl,
		});
	};
	return (
		<div className="flex flex-col items-center justify-center p-5 h-5">
			<button
				className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded align-middle"
				onClick={onClick}
			>
				<p className="items-center justify-center">Sign in with </p>
				<div className="pl-2 relative">
					<Image src="/Google__G__Logo.svg" alt="Google Logo" width={30} height={30} />
				</div>
			</button>
		</div>
	);
};

export default GoogleSignIn;
