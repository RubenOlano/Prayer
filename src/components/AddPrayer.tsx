import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const plus = (
	<svg
		className="w-4 h-4 md:mr-1"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
	</svg>
);

const AddPrayer = () => {
	const router = useRouter();
	const groupId = router.query.groupId as string;

	return (
		<Link href={`/posts/create?groupId=${groupId}`}>
			<button
				className="flex text-sm flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
				type="button"
			>
				{plus}
				<span>Add Request</span>
			</button>
		</Link>
	);
};

export default AddPrayer;
