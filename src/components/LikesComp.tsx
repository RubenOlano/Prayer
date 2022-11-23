import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";
import Liked from "/public/FilledMoji.svg";
import NotLiked from "/public/OutlinedMoji.svg";

const LikesComp = () => {
	const postId = useRouter().query.postId as string;
	const utils = trpc.useContext();

	const { data: liked } = trpc.posts.getUserLiked.useQuery({ postId });
	const { data: numLikes } = trpc.posts.getNumberOfLikes.useQuery({ postId });
	const { mutate } = trpc.posts.toggleLikePost.useMutation({
		onMutate: async () => {
			await utils.posts.getUserLiked.refetch({ postId });
			await utils.posts.getNumberOfLikes.refetch({ postId });
		},
	});

	return (
		<div className="btn btn-secondary" onClick={() => mutate({ postId })}>
			<label className="swap swap-rotate">
				<input type="checkbox" defaultChecked={liked} />
				<Image src={Liked} width="20" height="20" alt="Icon" className="swap-on" />
				<Image src={NotLiked} width="20" height="20" alt="Icon" className="swap-off" />
			</label>
			<p className="ml-2">{numLikes || 0}</p>
		</div>
	);
};

export default LikesComp;
