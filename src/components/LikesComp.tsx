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
		onSuccess: async () => {
			await utils.posts.getUserLiked.refetch({ postId });
			await utils.posts.getNumberOfLikes.refetch({ postId });
		},
	});

	return (
		<div className={`btn btn-primary btn-outline ${liked && "btn-active"}`} onClick={() => mutate({ postId })}>
			<label className="swap swap-rotate">
				{liked !== undefined ? (
					<input type="checkbox" defaultChecked={liked} />
				) : (
					<input type="checkbox" defaultChecked={false} />
				)}
				<Image
					src={Liked}
					width="20"
					height="20"
					alt="Icon"
					className={liked !== undefined && liked ? "swap-off" : "swap-on"}
				/>
				<Image
					src={NotLiked}
					width="20"
					height="20"
					alt="Icon"
					className={liked !== undefined && liked ? "swap-on" : "swap-off"}
				/>
			</label>
			<p className="ml-2">{numLikes || 0}</p>
		</div>
	);
};

export default LikesComp;
