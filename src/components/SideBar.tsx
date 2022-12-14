import Image from "next/image";
import Icon from "public/favicon.ico";
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
const CompassOutline = dynamic(() => import("./Icons").then(mod => mod.Compass));
const CompassFill = dynamic(() => import("./Icons").then(mod => mod.CompassFill));

interface Props {
  session: Session;
}

const SideBar: FC<Props> = ({ session }) => {
  const path = useRouter().pathname.split("/")[1];

  if (!session) return null;

  return (
    <nav className="h-full w-40 hidden md:block fixed top-0 left-0 navbar bg-base-100 border-r justify-between">
      <div className="flex flex-col justify-center items-center h-1/6">
        <Image src={Icon} className="rounded-full h-10 w-10" alt="Group Pray Logo" priority />
        <h1 className="text-2xl font-bold">Group Pray</h1>
      </div>
      <Link className="flex flex-row justify-center h-1/6 btn-ghost" href="/" aria-label="Navigate to the Home Feed">
        <h1 className="text-2xl font-bold flex justify-center items-center">
          {path === "" ? <HouseFill /> : <HouseOutline />}
          Home
        </h1>
      </Link>
      <Link className="flex flex-row justify-center h-1/6 btn-ghost" href="/groups" aria-label="View your Groups">
        <h1 className="text-2xl font-bold flex justify-center items-center">
          {path === "groups" ? <PeopleFill /> : <PeopleOutline />}
          Groups
        </h1>
      </Link>
      <Link className="flex flex-row justify-center h-1/6 btn-ghost" href="/explore" aria-label="Explore new groups">
        <h1 className="text-2xl font-bold flex justify-center items-center">
          {path === "explore" ? <CompassFill /> : <CompassOutline />}
          Explore
        </h1>
      </Link>
      <Link
        className="flex flex-row justify-center h-1/6 btn-ghost mr-2"
        href="/profile"
        aria-label="Edit your profile"
      >
        {session && session.user ? (
          <h1 className="text-2xl font-bold flex justify-center items-center">
            <Image
              src={getImage(session.user.image)}
              className={`rounded-full h-10 w-10 object-cover mr-2 avatar${
                path === "profile" ? "border-2 border-secondary" : ""
              }`}
              height={10}
              width={10}
              alt="User Profile Picture"
              priority
            />
            Profile
          </h1>
        ) : (
          <Link href="/auth/signin" aria-label="Sign in or create an account">
            <h1 className="text-xl font-bold flex justify-center items-center">Sign In</h1>
          </Link>
        )}
      </Link>
      {session && session.user && (
        <div className="flex flex-row justify-center h-1/6 btn-ghost cursor-pointer" onClick={() => signOut()}>
          <h1 className="text-xl font-bold flex justify-center items-center">Sign Out</h1>
        </div>
      )}
    </nav>
  );
};

export default SideBar;
