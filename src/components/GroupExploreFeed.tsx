import React from "react";
import { trpc } from "../utils/trpc";
import ExploreCards from "./ExploreCards";

const GroupExploreFeed = () => {
	const { data } = trpc.groups.getExploreGroups.useQuery();
	return (
		<div className="w-full p-5">
			<div className="grid md:grid-cols-3 gap-2 grid-flow-row">
				{data && data.map(group => <ExploreCards group={group} key={group.id} />)}
			</div>
		</div>
	);
};

export default GroupExploreFeed;
