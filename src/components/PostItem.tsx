import { Group, Post } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";
import PostDeleteButton from "./PostDeleteButton";

interface Props {
	post: Post & {
		Group: Group | null;
	};
}
const PostItem: FC<Props> = ({ post }) => {
	return (
		<div className="flex">
			<div className="align-middle my-auto">
				<PostDeleteButton postId={post.id} />
			</div>
			<Link
				href={`/posts/${post.id}`}
				className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25 w-full"
			>
				<h2 className="text-2xl font-bold text-center m-3">{post.title}</h2>
				<p className="italic font-bold text-center ">{post?.Group?.name}</p>
			</Link>
		</div>
	);
};

export default PostItem;
