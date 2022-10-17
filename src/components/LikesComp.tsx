import Image from "next/image";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	postId: string;
}

const LikesComp: FC<Props> = ({ postId }) => {
	const { data: liked, isLoading } = trpc.useQuery(["posts.getUserLiked", { postId: postId }]);
	const { data: numLikes } = trpc.useQuery(["posts.getNumberOfLikes", { postId: postId }]);

	if (isLoading) {
		return <div className="flex flex-row items-center justify-center">Loading...</div>;
	}
	return (
		<div className="flex flex-row items-center justify-center cursor-pointer p-3 bg-orange-400 rounded-md hover:bg-orange-500 m-3">
			<Image src={`/${liked ? "FilledMoji" : "OutlinedMoji"}.svg`} width="20" height="20" alt="Icon" />
			<p className="ml-2">{numLikes || 0}</p>
		</div>
	);
};

export default LikesComp;
