import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getImage } from "../utils/defaultUserImage";
import { Session } from "next-auth";
import { FC } from "react";
import { signOut } from "next-auth/react";
import { Compass, CompassFill } from "./Icons";

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
		<div className="md:hidden bg-base-100 btm-nav z-10">
			<Link href="/" className={`${path === "" && "active"}`} aria-label="Navigate to the Home Feed">
				{path === "" ? <HouseFill omitPadding /> : <HouseOutline omitPadding />}
			</Link>
			<Link href="/groups" className={`${path === "groups" && "active"}`} aria-label="View your groups">
				{path === "groups" ? <PeopleFill omitPadding /> : <PeopleOutline omitPadding />}
			</Link>
			<Link href="/explore" className={`${path === "explore" && "active"}`} aria-label="Explore new groups">
				{path === "explore" ? <CompassFill omitPadding /> : <Compass omitPadding />}
			</Link>
			{session && session.user ? (
				<Link href="/profile" className={`${path === "profile" && "active"}`} aria-label="Edit your profile">
					<Image
						src={getImage(session.user.image)}
						className={`rounded-full h-5 w-5 object-cover avatar ${
							path === "profile" && "border-2 border-accent"
						}`}
						height={5}
						width={5}
						alt="PFP"
						priority
					/>
				</Link>
			) : (
				<h1
					className="text-xl font-bold flex justify-center items-center"
					aria-label="Sign in or create an account"
				>
					<Link href="/auth/signin">Sign In</Link>
				</h1>
			)}
			{session && session.user && (
				<div className="p-5 justify-center self-center">
					<h1 className="text-xs font-bold flex justify-center items-center">
						<button onClick={() => signOut()}>Sign Out</button>
					</h1>
				</div>
			)}
		</div>
	);
};

export default BottomBar;
