import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getImage } from "../utils/defaultUserImage";
import { Session } from "next-auth";
import { FC } from "react";
import { signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const HouseFill = dynamic(() => import("./Icons").then(mod => mod.HouseFill));
const HouseOutline = dynamic(() => import("./Icons").then(mod => mod.HouseOutline));
const PeopleOutline = dynamic(() => import("./Icons").then(mod => mod.PeopleOutline));
const PeopleFill = dynamic(() => import("./Icons").then(mod => mod.PeopleFill));

interface Props {
	session: Session;
}

const BottomBar: FC<Props> = ({ session }) => {
	const path = useRouter().pathname.split("/")[1];
	const utils = trpc.useContext();

	if (!session) {
		return <></>;
	}

	const clickGroups = async () => {
		if (path === "groups") return;
		await utils.groups.getGroups.prefetch();
	};

	const clickHome = async () => {
		if (path === "") return;
		await utils.posts.getPostFeed.prefetchInfinite({ cursor: null, limit: 5 });
	};

	const clickProfile = async () => {
		if (path === "profile" || !session || !session.user) return;
		await utils.users.getUser.prefetch({ id: session.user.id });
	};

	return (
		<div className="bg-[#A3290E] w-full md:hidden fixed text-[#86FFCE] bottom-0 overflow-hidden flex h-20">
			<div className="p-5 justify-center self-center">
				<Link href="/" onClick={clickHome}>
					{path === "" ? <HouseFill omitPadding /> : <HouseOutline omitPadding />}
				</Link>
			</div>
			<div className="p-5 justify-center self-center">
				<Link href="/groups" onClick={clickGroups}>
					{path === "groups" ? <PeopleFill omitPadding /> : <PeopleOutline omitPadding />}
				</Link>
			</div>
			<div className="p-5 justify-center self-center">
				{session && session.user ? (
					<h1 className="text-xl font-bold flex justify-center items-center">
						<Link href="/profile" onClick={clickProfile}>
							<Image
								src={getImage(session.user.image)}
								className={`rounded-full h-5 w-5 object-cover ${
									path === "profile" ? "border-2 border-[#86FFCE]" : ""
								}`}
								height={5}
								width={5}
								alt="PFP"
								priority
							/>
						</Link>
					</h1>
				) : (
					<h1 className="text-xl font-bold flex justify-center items-center">
						<Link href="/auth/signin">Sign In</Link>
					</h1>
				)}
			</div>
			{session && session.user && (
				<div className="p-5 justify-center self-center">
					<h1 className="text-sm font-bold flex justify-center items-center">
						<button onClick={() => signOut()}>Sign Out</button>
					</h1>
				</div>
			)}
		</div>
	);
};

export default BottomBar;
