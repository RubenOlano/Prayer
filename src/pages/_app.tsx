import { trpc } from "../utils/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import "../styles/globals.css";
import SideBar from "../components/SideBar";
import BottomBar from "../components/BottomBar";
import { Kanit } from "@next/font/google";

const kanit = Kanit({
	weight: ["300", "400", "500", "600", "700"],
});

const MyApp: AppType<{
	session: Session;
}> = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<>
			<style jsx global>
				{`
					html {
						font-family: ${kanit.style.fontFamily};
					}
				`}
			</style>
			<SessionProvider session={session}>
				<SideBar session={session} />
				<BottomBar session={session} />
				<Component {...pageProps} />
			</SessionProvider>
		</>
	);
};

export default trpc.withTRPC(MyApp);
