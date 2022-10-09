import { useRouter } from "next/router";
import React from "react";

const plus = (
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
			d="M12 6v6m0 0v6m0-6h6m-6 0H6"
		/>
	</svg>
);

const AddPrayer = () => {
	const [text, setText] = React.useState("Add Request");

	const router = useRouter();
	const { groupId } = router.query;

	const onClick = () => {
		setText("Loading...");
		router.push(`/posts/create?groupId=${groupId}`);
	};

	return (
		<button
			className="flex flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
			type="button"
			onClick={onClick}
		>
			{plus}
			<span>{text}</span>
		</button>
	);
};

export default AddPrayer;
