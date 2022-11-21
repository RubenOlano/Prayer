import React from "react";
import { trpc } from "../utils/trpc";
import ExploreCards from "./ExploreCards";

const GroupExploreFeed = () => {
	const { data, isLoading } = trpc.groups.getExploreGroups.useQuery();

	if (isLoading) {
		return (
			<div className="w-full p-5">
				<div className="grid md:grid-cols-3 gap-2 grid-flow-row">
					{Array.from({ length: 5 }).map((_, i) => (
						<ExploreCards.Skeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full p-5">
			<div className="grid md:grid-cols-3 gap-2 grid-flow-row">
				{data && data.map(group => <ExploreCards group={group} key={group.id} />)}
			</div>
		</div>
	);
};

export default GroupExploreFeed;
