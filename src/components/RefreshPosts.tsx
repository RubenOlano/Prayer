import React from "react";
import { trpc } from "../utils/trpc";
import { Refresh } from "./Icons";

function RefreshPosts() {
	const [isLoading, setIsLoading] = React.useState(false);
	const utils = trpc.useContext();
	const onClick = async () => {
		setIsLoading(true);
		await utils.posts.getGroupPosts.invalidate();
		setIsLoading(false);
	};
	return (
		<button className={`btn ${isLoading && "loading"}`} type="button" onClick={onClick} disabled={isLoading}>
			{!isLoading && <Refresh dimensions={20} />}
		</button>
	);
}

export default RefreshPosts;

RefreshPosts.Skeleton = function RefreshPostsSkeleton() {
	return (
		<button className="btn btn-disabled" type="button">
			<Refresh dimensions={20} />
		</button>
	);
};
