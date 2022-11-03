import { Post, User } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";
import PostDeleteButton from "./PostDeleteButton";

interface Props {
	pubPosts: (Post & {
		author: User;
	})[];
	privatePosts: Post[];
}

const AdminRequests: FC<Props> = ({ pubPosts, privatePosts }) => {
	return (
		<>
			<div className="flex flex-col py-2 h-[30rem] overflow-scroll">
				{pubPosts &&
					pubPosts.length > 0 &&
					pubPosts.map(post => (
						<div className="flex flex-row justify-center items-center rounded-sm m-2 p-auto " key={post.id}>
							<PostDeleteButton postId={post.id} />
							<Link
								className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25 w-full"
								key={post.id}
								href={`/posts/${post.id}`}
							>
								<h2 className="text-2xl font-bold text-center m-3">{post.title}</h2>
								<p className="italic font-bold text-center ">{post.author.name}</p>
							</Link>
						</div>
					))}
				{privatePosts &&
					privatePosts.length > 0 &&
					privatePosts.map(post => (
						<div className="flex flex-row justify-center items-center rounded-sm m-2 p-auto " key={post.id}>
							<PostDeleteButton postId={post.id} />
							<Link
								href={`/posts/${post.id}`}
								className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25 w-full"
								key={post.id}
							>
								<h2 className="text-2xl font-bold text-center m-3">{post.title}</h2>
								<p className="italic font-bold text-center ">Anonymous</p>
							</Link>
						</div>
					))}
			</div>
		</>
	);
};

export default AdminRequests;
