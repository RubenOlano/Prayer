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
			className={`flex text-sm flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2 ${
				isLoading ? "opacity-50 cursor-not-allowed" : ""
			}`}
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
