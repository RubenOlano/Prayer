import React from "react";
import { trpc } from "../utils/trpc";
import ExploreCards from "./ExploreCards";

const GroupExploreFeed = () => {
	const { data, isLoading } = trpc.groups.getExploreGroups.useQuery();

	if (data && data?.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center pt-5">
				<h1 className="text-2xl font-bold">No groups found</h1>
				<p>There are no groups to show. Try creating one!</p>
			</div>
		);
	}

	return (
		<div className="p-5">
			<div className="md:grid grid-cols-3 gap-3 m-3">
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => <ExploreCards.Skeleton key={i} />)
					: data && data.map(group => <ExploreCards group={group} key={group.id} />)}
			</div>
		</div>
	);
};

export default GroupExploreFeed;
