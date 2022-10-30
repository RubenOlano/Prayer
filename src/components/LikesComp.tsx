import Image from "next/image";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	postId: string;
}

const LikesComp: FC<Props> = ({ postId }) => {
	const utils = trpc.useContext();
	const { data: liked, isLoading } = trpc.useQuery(["posts.getUserLiked", { postId: postId }]);
	const { data: numLikes } = trpc.useQuery(["posts.getNumberOfLikes", { postId: postId }]);
	const { mutate } = trpc.useMutation("posts.toggleLikePost", {
		onMutate: async () => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await utils.cancelQuery(["posts.getUserLiked", { postId }]);
			await utils.cancelQuery(["posts.getNumberOfLikes", { postId }]);
			// Snapshot the previous value
			const previousValue = liked;
			const previousNumLikes = numLikes;
			// Check if numLikes is undefined
			if (previousNumLikes === undefined) {
				return;
			}
			// Check if the user has liked the post
			if (liked) {
				// If they have, decrement the number of likes
				utils.setQueryData(["posts.getNumberOfLikes", { postId }], previousNumLikes - 1);
				// Set the user to not have liked the post
				utils.setQueryData(["posts.getUserLiked", { postId }], false);
			} else {
				// If they haven't, increment the number of likes
				utils.setQueryData(["posts.getNumberOfLikes", { postId }], previousNumLikes + 1);
				// Set the user to have liked the post
				utils.setQueryData(["posts.getUserLiked", { postId }], true);
			}
			// Return a context object with the snapshotted value
			return { previousValue };
		},
	});

	if (isLoading) {
		return <div className="flex flex-row items-center justify-center">Loading...</div>;
	}
	return (
		<div
			className="flex flex-row items-center justify-center cursor-pointer p-3 bg-orange-400 rounded-md hover:bg-orange-500 m-3"
			onClick={() => mutate({ postId })}
		>
			<Image src={`/${liked ? "FilledMoji" : "OutlinedMoji"}.svg`} width="20" height="20" alt="Icon" />
			<p className="ml-2">{numLikes || 0}</p>
		</div>
	);
};

export default LikesComp;
