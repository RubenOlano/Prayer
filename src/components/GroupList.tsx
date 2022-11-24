import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";
import { Plus } from "./Icons";

const GroupList = () => {
	const { data, isLoading } = trpc.groups.getGroups.useQuery();

	if (data?.length == 0) {
		return (
			<div className="w-full p-5">
				<div className="h-24">
					<Link
						href="/groups/create"
						className="bg-accent hover:bg-accent-focus text-white font-bold rounded flex items-center justify-center m-2 p-3 text-5xl"
					>
						<Plus dimensions={60} />
					</Link>
					<h1 className="text-2xl text-center">No groups</h1>
					<p className="text-center ">Make your own group</p>
					<span className=" font-bold  flex items-center justify-center m-2 p-3 text-5xl">or</span>
					<Link
						href="/explore"
						className="bg-info hover:bg-info-focus text-white font-bold rounded flex items-center justify-center m-2 p-3 text-5xl"
					>
						Join one
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full p-5">
			<div className="grid md:grid-cols-3 gap-2 h-24">
				<Link
					href="/groups/create"
					className="bg-accent hover:bg-accent-focus text-white font-bold rounded flex items-center justify-center m-2 p-3 text-5xl"
					aria-label="Create a group"
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
