import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	id: string;
	authorName: string | null;
	groupName: string;
	title: string;
	content: string;
	createdAt: Date;
	groupId: string;
	authorImage?: string;
}

const PostCard: FC<Props> = post => {
	const utils = trpc.useContext();

	return (
		<Link
			href={`/posts/${post.id}`}
			className="hover:cursor-pointer card card-normal shadow-xl bg-neutral text-neutral-content m-5"
			onClick={async () => {
				await utils.posts.getPost.prefetch({ postId: post.id });
			}}
		>
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
};

export default PostCard;
