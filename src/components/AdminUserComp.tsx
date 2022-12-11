import { GroupMember, User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	member: GroupMember & { User: User };
}

function AdminUserComp({ member }: Props) {
	const user = member.User;
	const utils = trpc.useContext();
	const { mutate, isLoading } = trpc.groups.removeGroupMember.useMutation({
		onSuccess: async () => {
			await utils.groups.fetchGroupNonAdmins.refetch({ groupId: member.groupId });
		},
	});

	const onclick = () => {
		mutate({ memberId: member.id, groupId: member.groupId });
	};

	return (
		<div className="flex flex-row items-center justify-center">
			<Image
				src={getImage(user.image)}
				alt={user.name || "Member"}
				width={30}
				height={30}
				className="rounded-full avatar"
			/>
			<h1 className="text-center ml-2">{user.name || "Member"}</h1>
			<button className={`btn btn-error btn-xs ${isLoading && "disabled"}`} onClick={onclick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 350 100"
					className="h-6 w-6"
					fill="gray"
					stroke="currentColor"
				>
					<path d="M0 0 6 0 0 6-6 0 0 0" fill="currentColor" transform="translate(175) scale(10)" />
				</svg>
			</button>
		</div>
	);
}

export default AdminUserComp;

AdminUserComp.Skeleton = function AdminUserCompSkeleton() {
	return (
		<div className="flex flex-row items-center justify-center">
			<Image src={getImage()} alt={"Member"} width={30} height={30} className="rounded-full avatar" />
			<h1 className="text-center ml-2">{"Member"}</h1>
			<button className={`btn btn-error btn-xs disabled`}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 350 100"
					className="h-6 w-6"
					fill="gray"
					stroke="currentColor"
				>
					<path d="M0 0 6 0 0 6-6 0 0 0" fill="currentColor" transform="translate(175) scale(10)" />
				</svg>
			</button>
		</div>
	);
};
