import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { getImage } from "../utils/defaultUserImage";

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
	return (
		<Link href={`/posts/${post.id}`} className="flex flex-col items-center m-2 p-3 hover:cursor-pointer">
			<div className="flex flex-col bg-[#5F1DAC] text-white rounded-lg m-2 p-3 hover:cursor-pointer hover:bg-opacity-75 w-full truncate">
				<div className="border-y-2 border-white flex items-center justify-between">
					<div className="flex align-middle justify-center m-3">
						<Image
							src={getImage(post.authorImage)}
							alt="name"
							height={25}
							width={25}
							className="rounded-full h-10 w-10"
						/>
						<h1 className="text-2xl font-bold text-left ml-3 self-center">{post.authorName ?? "Member"}</h1>
					</div>
					<div>
						<h3>{post.groupName}</h3>
					</div>
				</div>
				<div className="border-b-2 border-white">
					<h1 className="text-2xl font-bold text-left m-3">{post.title}</h1>
					<h3 className="text-xl font-bold text-center m-3">{post.content}</h3>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
