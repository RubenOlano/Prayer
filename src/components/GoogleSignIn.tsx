import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
	provider: ClientSafeProvider;
}

const GoogleSignIn: FC<Props> = ({ provider }) => {
	const router = useRouter();
	const { callbackUrl } = router.query;
	const onClick = async () => {
		await signIn(provider.id, {
			callbackUrl: (callbackUrl as string) || "/",
		});
	};
	return (
		<div className="flex flex-col items-center justify-center p-5 h-5">
			<button
				className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded align-middle"
				onClick={onClick}
			>
				<p className="flex flex-row items-center justify-center">
					Sign in with{" "}
					<div className="pl-2">
						<Image src="/Google__G__Logo.svg" alt="Google Logo" width={30} height={30} />
					</div>
				</p>
			</button>
		</div>
	);
};

export default GoogleSignIn;
