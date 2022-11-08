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
			className="flex flex-col items-center m-2 md:p-3 hover:cursor-pointer"
			onClick={async () => {
				await utils.posts.getPost.prefetch({ postId: post.id });
			}}
		>
			<div className="flex flex-col bg-[#5F1DAC] text-white rounded-lg m-2 p-3 hover:cursor-pointer hover:bg-opacity-75 max-w-[95%] md:max-w-[70%]">
				<div className="border-y-2 border-white md:flex items-center justify-between">
					<div className="md:flex align-middle justify-center m-3">
						<Image
							src={getImage(post.authorImage)}
							alt="name"
							height={25}
							width={25}
							className="rounded-full md:h-10 md:w-10 h-5 w-5"
						/>
						<h1 className="md:text-2xl text-sm font-bold text-left md:ml-3 md:self-center">
							{post.authorName ?? "Member"}
						</h1>
					</div>
					<div>
						<h3 className="md:text-2xl text-sm font-bold md:text-right md:mr-3 md:self-center">
							{post.groupName}
						</h3>
					</div>
				</div>
				<div className="border-b-2 border-white">
					<h1 className="text-sm md:text-2xl font-bold text-left m-3">{post.title}</h1>
					<h3 className="text-sm md:text-xl font-bold text-center m-3">{post.content}</h3>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
