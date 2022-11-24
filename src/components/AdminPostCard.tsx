import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";
import { X } from "./Icons";

interface Props {
	id: string;
	authorName: string | null;
	groupName: string;
	title: string;
	content: string;
	createdAt: Date;
	groupId: string;
	authorImage?: string | null;
}

function AdminPostCard(post: Props) {
	const utils = trpc.useContext();

	const { mutate } = trpc.posts.deletePost.useMutation({
		onSuccess: async () => {
			await utils.posts.getGroupPosts.refetch({ groupId: post.groupId });
		},
		onMutate: async data => {
			utils.posts.getGroupPosts.setData({ groupId: post.groupId }, prev => {
				if (!prev) return { posts: [], nextCursor: undefined };
				return {
					posts: prev.posts.filter(post => post.id !== data.postId),
					nextCursor: prev.nextCursor,
				};
			});
		},
	});

	return (
		<Link
			href={`/posts/${post.id}`}
			className="cursor-pointer card card-compact shadow-xl bg-neutral text-neutral-content m-5"
		>
			<div className="card-actions">
				<button className="btn btn-ghost" onClick={() => mutate({ postId: post.id })}>
					<X dimensions={20} />
				</button>
			</div>
			<div className="card-body justify-center self-center text-2xl">
				<Image
					src={getImage(post.authorImage)}
					alt="name"
					height={25}
					width={25}
					className="avatar avatar-sm rounded-full justify-center self-center"
				/>
				<h1>{post.authorName ?? "Member"}</h1>
				<h1>{post.groupName}</h1>
			</div>
			<div className="border-accent border-y-2 card-body">
				<h1 className="card-title text-center justify-center">{post.title}</h1>
				<h3 className="m-2">{post.content}</h3>
			</div>
		</Link>
	);
}

export default AdminPostCard;

AdminPostCard.Skeleton = function PostCardSkeleton() {
	return (
		<div className="cursor-pointer card card-compact shadow-xl bg-neutral text-neutral-content m-5 animate-pulse">
			<div className="card-body justify-center self-center text-2xl">
				<div className="avatar avatar-sm rounded-full justify-center self-center" />
				<h1 />
				<h1 />
			</div>
			<div className="border-accent border-y-2 card-body">
				<h1 className="card-title text-center justify-center" />
				<h3 className="m-2" />
			</div>
		</div>
	);
};
