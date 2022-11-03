import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";

interface Props {
	userId: string;
}

const GroupList: FC<Props> = ({ userId }) => {
	if (!userId) {
		signIn(undefined, { callbackUrl: "/groups" });
		return (
			<div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">
				Redirecting...
			</div>
		);
	}
	const { data, isLoading } = trpc.groups.getGroups.useQuery({ userId });

	if (isLoading) {
		return (
			<div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">Loading...</div>
		);
	}

	if (data?.length == 0 && !isLoading) {
		return (
			<div className="text-center backdrop-sepia-0 bg-white/60 mx-3">
				<h2 className="text-lg md:text-2xl justify-center font-bold flex p-5">Groups</h2>
				<div className="overflow-y-scroll h-[55vh]">
					<Link
						href="/groups/create"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Create a group
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">
			<h2 className="text-2xl justify-center font-bold flex p-5">Groups</h2>
			<div className="overflow-scroll h-[55vh]">
				<Link
					href="/groups/create"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Create a group
				</Link>
				{data?.map(group => (
					<GroupItem key={group.id} group={group} />
				))}
			</div>
		</div>
	);
};

export default GroupList;
