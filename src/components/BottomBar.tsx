import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getImage } from "../utils/defaultUserImage";
import { Session } from "next-auth";
import { FC } from "react";
import { signOut } from "next-auth/react";

const HouseFill = dynamic(() => import("./Icons").then(mod => mod.HouseFill));
const HouseOutline = dynamic(() => import("./Icons").then(mod => mod.HouseOutline));
const PeopleOutline = dynamic(() => import("./Icons").then(mod => mod.PeopleOutline));
const PeopleFill = dynamic(() => import("./Icons").then(mod => mod.PeopleFill));

interface Props {
	session: Session;
}

const BottomBar: FC<Props> = ({ session }) => {
	const path = useRouter().pathname.split("/")[1];

	if (!session) {
		return <></>;
	}

	return (
		<div className="bg-[#A3290E] w-full md:hidden fixed text-[#86FFCE] bottom-0 overflow-hidden flex h-20">
			<div className="p-5 justify-center self-center">
				<Link href="/">{path === "" ? <HouseFill omitPadding /> : <HouseOutline omitPadding />}</Link>
			</div>
			<div className="p-5 justify-center self-center">
				<Link href="/groups">
					{path === "groups" ? <PeopleFill omitPadding /> : <PeopleOutline omitPadding />}
				</Link>
			</div>
			<div className="p-5 justify-center self-center">
				{session && session.user ? (
					<h1 className="text-xl font-bold flex justify-center items-center">
						<Link href="/profile">
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
