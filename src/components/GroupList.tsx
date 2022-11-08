import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";
import { Plus } from "./Icons";

const GroupList = () => {
	const { data, isLoading } = trpc.groups.getGroups.useQuery();

	if (isLoading) {
		return <div className="flex flex-col text-center px-12 pt-12 pb-5 ">Loading...</div>;
	}

	if (data?.length == 0 && !isLoading) {
		return (
			<div className="text-center backdrop-sepia-0 mx-3">
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
		<div className="w-full p-5">
			<div className="grid md:grid-cols-3 grid-flow-row">
				<Link
					href="/groups/create"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center m-2 p-3 text-5xl"
				>
					<Plus dimensions={60} />
				</Link>
				{data?.map(group => (
					<GroupItem key={group.id} group={group} />
				))}
			</div>
		</div>
	);
};

export default GroupList;
