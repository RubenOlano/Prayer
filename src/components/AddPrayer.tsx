import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { plus } from "./Icons";

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
