import { Group, GroupMember, Post } from "@prisma/client";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
	post: Post & {
		Group:
			| (Group & {
					GroupMembers: GroupMember[];
			  })
			| null;
	};
}

const PostPage: FC<Props> = ({ post }) => {
	const router = useRouter();
	return (
		<div className="grid text-center justify-center items-center h-[80vh] p-3">
			<h1 className="text-2xl md:text-6xl font-bold">{post.title}</h1>
			<p className="text-lg md:text-2xl">{post.content}</p>
			<p className="text-base gray-400 md:text-2xl">
				{post.createdAt.toLocaleString()}{" "}
			</p>
			<h2
				className="text-lg md:text-3xl font-bold hover:cursor-pointer"
				onClick={() => router.push(`/groups/${post.groupId}`)}
			>
				Posted in {post.Group?.name} - {post.Group?.description}
			</h2>
		</div>
	);
};

export default PostPage;
