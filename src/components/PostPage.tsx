import { Group, GroupMember, Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";
import LikesComp from "./LikesComp";

interface Props {
	post: Post & {
		Group: (Group & { GroupMembers: GroupMember[] }) | null;
	};
}

const PostPage: FC<Props> = ({ post }) => {
	const { data } = trpc.users.getUser.useQuery(
		{ id: post.authorId },
		{
			enabled: !post.anonymous,
		}
	);
	return (
		<div className="min-h-[80vh] align-middle backdrop-blur-2xl">
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 rounded-md md:max-w-[65vw]">
				<h1 className="text-2xl font-bold">{post.title}</h1>
				<p className="text-xl text-center">{post.content}</p>
				<br />
				{data && (
					<div className="flex flex-col items-center justify-center">
						<h2 className="text-xl font-bold">Author</h2>
						<p className="text-lg">{data.name}</p>
						<div className="rounded-full overflow-hidden">
							<Image src={getImage(data.image)} alt="User Image" width={100} height={100} />
						</div>
					</div>
				)}
				<p>{post.createdAt.toDateString()} </p>
				<div className="flex flex-row items-center justify-center hover:cursor-pointer">
					<LikesComp postId={post.id} />
				</div>
				<Link
					href={`/groups/${post.Group?.id}`}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					View Group
				</Link>
			</div>
		</div>
	);
};

export default PostPage;
