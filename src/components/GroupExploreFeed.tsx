import React from "react";
import { trpc } from "../utils/trpc";
import ExploreCards from "./ExploreCards";

const GroupExploreFeed = () => {
	const { data, isLoading } = trpc.groups.getExploreGroups.useQuery();

	if (isLoading) {
		return (
			<div className="p-5 animate-pulse">
				<div className="md:grid md:grid-cols-3 gap-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<ExploreCards.Skeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-5">
			<div className="md:grid grid-cols-3">
				{data && data.map(group => <ExploreCards group={group} key={group.id} />)}
			</div>
		</div>
	);
};

export default GroupExploreFeed;
