import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";
import { Plus } from "./Icons";

const GroupList = () => {
	const { data, isLoading } = trpc.groups.getGroups.useQuery();

	return (
		<div className="w-full p-5">
			<div className="grid md:grid-cols-3 gap-2 h-24">
				<Link
					href="/groups/create"
					className="bg-accent hover:bg-accent-focus text-white font-bold rounded flex items-center justify-center m-2 p-3 text-5xl"
				>
					<Plus dimensions={60} />
				</Link>
				{isLoading
					? Array.from({ length: 6 }).map((_, i) => <GroupItem.Skeleton key={i} />)
					: data?.map(group => <GroupItem key={group.id} group={group} />)}
			</div>
		</div>
	);
};

export default GroupList;
