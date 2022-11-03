"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "../utils/defaultUserImage";

export const dynamic = "auto",
	dynamicParams = true,
	revalidate = false,
	fetchCache = "auto",
	runtime = "nodejs",
	preferredRegion = "auto";

const NavBar = () => {
	const { data } = useSession();
	if (!data || !data.user) {
		// If no session exists, display access to sign-in page
		return (
			<div className="flex items-center justify-between px-4 py-3 bg-gray-900">
				<div className="flex items-center">
					<Link href="/" className="text-xl font-bold text-white">
						NextAuth.js
					</Link>
				</div>
				<div className="flex items-center">
					<Link
						className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-700"
						href="/auth/signin"
					>
						Sign in
					</Link>
				</div>
			</div>
		);
	}
	const user = data.user;
	return (
		<nav className="grid bg-teal-500 py-4 md:py-6 px-3 align-center ">
			<div className="col-start-1 col-end-4 md:col-end-3 items-center flex-shrink-0 text-white ">
				<Link href="/" className="cursor-pointer">
					<span className="font-semibold text-lg md:text-xl tracking-tight">Group Pray</span>
				</Link>
			</div>
			<div className="col-start-5  md:col-start-7 col-end-9 items-center grid grid-cols-7">
				{user ? (
					<>
						<a
							// onClick={() => signOut()}
							className="text-center mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer col-start-3  md:col-start-4 col-end-7"
						>
							Log out
						</a>
						<Link
							className="col-start-7 col-end-7 align-middle justify-center items-center flex hover:cursor-pointer"
							href="/profile"
						>
							<Image
								src={getImage(user?.image)}
								alt={`${user?.name}` || "user"}
								width={30}
								height={30}
								className="rounded-full"
							/>
						</Link>
					</>
				) : (
					<>
						<Link
							href="/auth/signin"
							className="col-start-4 col-end-7 mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer col-auto"
						>
							Log in
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
