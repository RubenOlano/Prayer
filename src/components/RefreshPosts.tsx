import { useState } from "react";
import { trpc } from "../utils/trpc";

const refreshIcon = (
	<svg
		className="w-6 h-6 md:mr-1"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5l7 7-7 7"
		/>
	</svg>
);

const RefreshPosts = () => {
	const [text, setText] = useState("Refresh");
	const utils = trpc.useContext();
	const onClick = () => {
		setText("Loading...");
		utils.invalidateQueries("posts.getGroupPosts").then(() => {
			setText("Refresh");
		});
	};
	return (
		<button
			className="flex flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
			type="button"
			onClick={onClick}
		>
			<div className="">{refreshIcon}</div>
			<span>{text}</span>
		</button>
	);
};

export default RefreshPosts;
