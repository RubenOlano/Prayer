import { GroupMember } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	member: GroupMember;
}

const x = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 350 100"
		className="h-6 w-6"
		fill="gray"
		stroke="currentColor"
	>
		<path
			d="M0 0 6 0 0 6-6 0 0 0"
			fill="currentColor"
			transform="translate(175) scale(10)"
		/>
	</svg>
);

const AdminComp: FC<Props> = ({ member }) => {
	const { data: user } = trpc.useQuery([
		"users.getUser",
		{ id: member.userId },
	]);
	if (!user) {
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-center m-2">
			<Image
				src={getImage(user.image)}
				alt={user.name || "Member"}
				width={30}
				height={30}
				className="rounded-full"
			/>
			<h1 className="text-cente ml-2">{user.name || "Member"}</h1>
			<button className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
				{x}
			</button>
		</div>
	);
};

export default AdminComp;
