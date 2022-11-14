import React from "react";
import { trpc } from "../utils/trpc";
import { Refresh } from "./Icons";

const RefreshPosts = () => {
	const [isLoading, setIsLoading] = React.useState(false);
	const utils = trpc.useContext();
	const onClick = async () => {
		setIsLoading(true);
		await utils.posts.getGroupPosts.invalidate();
		setIsLoading(false);
	};
	return (
		<button
			className={`btn ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
			type="button"
			onClick={onClick}
			disabled={isLoading}
		>
			<div className={isLoading ? "animate-spin" : ""}>
				<Refresh dimensions={20} />
			</div>
		</button>
	);
};

export default RefreshPosts;
