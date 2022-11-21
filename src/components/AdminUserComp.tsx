import { GroupMember } from "@prisma/client";
import Image from "next/image";
import React, { FC } from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	member: GroupMember;
}

const Upgrade = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 100" className="h-6 w-6" fill="gray" stroke="currentColor">
		<path d="M0 0 6 0 0 6-6 0 0 0" fill="currentColor" transform="translate(175) scale(10)" />
	</svg>
);

const AdminUserComp: FC<Props> = ({ member }) => {
	const utils = trpc.useContext();
	const { data: user } = trpc.users.getUser.useQuery({ id: member.userId });

	const { mutate, isLoading } = trpc.groups.removeGroupMember.useMutation({
		onSuccess: async () => {
			await utils.groups.fetchGroupNonAdmins.invalidate();
		},
	});

	const onclick = () => {
		mutate({ memberId: member.id, groupId: member.groupId });
	};

	if (!user) {
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-center m-2">
			<button className="flex flex-row items-center justify-center bg-gray-200 rounded-full p-2">
				{Upgrade}
			</button>
			<Image
				src={getImage(user.image)}
				alt={user.name || "Member"}
				width={30}
				height={30}
				className="rounded-full"
			/>
			<h1 className="text-center ml-2">{user.name || "Member"}</h1>
			<button
				className={`ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
				onClick={onclick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	);
};

export default AdminUserComp;
