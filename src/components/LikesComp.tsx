import Image from "next/image";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import Liked from "/public/FilledMoji.svg";
import NotLiked from "/public/OutlinedMoji.svg";

interface Props {
	postId: string;
}

const LikesComp: FC<Props> = ({ postId }) => {
	const utils = trpc.useContext();
	const { data: liked, isLoading } = trpc.posts.getUserLiked.useQuery({ postId });
	const { data: numLikes } = trpc.posts.getNumberOfLikes.useQuery({ postId });
	const { mutate } = trpc.posts.toggleLikePost.useMutation({
		onMutate: async () => {
			await utils.posts.getUserLiked.invalidate({ postId });
			await utils.posts.getNumberOfLikes.invalidate({ postId });
			const previousValue = liked;
			const previousNumLikes = numLikes;
			if (previousNumLikes === undefined) {
				return;
			}
			if (liked) {
				utils.posts.getNumberOfLikes.setData({ postId }, () => previousNumLikes - 1);
				utils.posts.getUserLiked.setData({ postId }, () => false);
			} else {
				utils.posts.getNumberOfLikes.setData({ postId }, () => previousNumLikes + 1);
				utils.posts.getUserLiked.setData({ postId }, () => true);
			}
			return { previousValue };
		},
	});

	if (isLoading) {
		return (
			<div className="btn btn-secondary">
				<Image src={NotLiked} width="20" height="20" alt="Icon" />
				<p className="ml-2">{numLikes || 0}</p>
			</div>
		);
	}
	return (
		<div className="btn btn-secondary" onClick={() => mutate({ postId })}>
			<Image src={liked ? Liked : NotLiked} width="20" height="20" alt="Icon" />
			<p className="ml-2">{numLikes || 0}</p>
		</div>
	);
};

export default LikesComp;
