import { trpc } from "../utils/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";

const MyApp: AppType<{
	session: Session;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
