import { Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	post: Post;
}

const PostCard: FC<Props> = ({ post }) => {
	return (
		<Link href={`/posts/${post.id}`} className="flex flex-col items-center m-2 p-3 hover:cursor-pointer">
			<div className="flex flex-col bg-black rounded-lg m-2 p-3 hover:cursor-pointer hover:bg-opacity-75 text-white w-full truncate">
				<div className="border-y-2 border-white flex items-center">
					<Image src={getImage()} alt="name" height={25} width={25} className="rounded-full h-10 w-10" />
					<h1 className="text-2xl font-bold text-left m-3">Full name</h1>
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
