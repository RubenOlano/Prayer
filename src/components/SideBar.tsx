import Image from "next/image";
import Icon from "public/favicon.ico";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getImage } from "../utils/defaultUserImage";
import { Session } from "next-auth";
import { FC } from "react";

const HouseFill = dynamic(() => import("./Icons").then(mod => mod.HouseFill));
const HouseOutline = dynamic(() => import("./Icons").then(mod => mod.HouseOutline));
const PeopleOutline = dynamic(() => import("./Icons").then(mod => mod.PeopleOutline));
const PeopleFill = dynamic(() => import("./Icons").then(mod => mod.PeopleFill));

interface Props {
	session: Session;
}

const SideBar: FC<Props> = ({ session }) => {
	const path = useRouter().pathname.split("/")[1];

	return (
		<div className="bg-[#A3290E] h-screen w-40 hidden md:block fixed text-[#86FFCE] top-0 left-0">
			<div className="flex flex-col justify-center items-center h-1/6">
				<Image src={Icon} className="rounded-full h-10 w-10" alt="Group Pray Logo" priority />
				<h1 className="text-2xl font-bold">Group Pray</h1>
			</div>
			<div className="flex flex-row justify-center  h-1/6">
				<h1 className="text-xl font-bold flex justify-center items-center">
					{path === "" ? <HouseFill /> : <HouseOutline />}
					<Link href="/">Home</Link>
				</h1>
			</div>
			<div className="flex flex-row justify-center  h-1/6">
				<h1 className="text-xl font-bold flex justify-center items-center">
					{path === "groups" ? <PeopleFill /> : <PeopleOutline />}
					<Link href="/groups">Groups</Link>
				</h1>
			</div>
			<div className="flex flex-row justify-center  h-1/6">
				{session && session.user ? (
					<h1 className="text-xl font-bold flex justify-center items-center">
						<Image
							src={getImage(session.user.image)}
							className={`rounded-full h-10 w-10 object-cover mr-2 ${
								path === "profile" ? "border-2 border-[#86FFCE]" : ""
							}`}
							height={10}
							width={10}
							alt="User Profile Picture"
							priority
						/>
						<Link href="/profile">Profile</Link>
					</h1>
				) : (
					<h1 className="text-xl font-bold flex justify-center items-center">
						<Link href="/auth/signin">Sign In</Link>
					</h1>
				)}
			</div>
		</div>
	);
};

export default SideBar;
