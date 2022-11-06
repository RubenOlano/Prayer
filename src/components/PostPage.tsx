import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { getImage } from "../utils/defaultUserImage";
import LikesComp from "./LikesComp";

interface Props {
	id: string;
	authorName: string | null;
	groupName: string;
	title: string;
	content: string;
	createdAt: Date;
	groupId: string;
	authorImage: string | undefined;
}

const PostPage: FC<Props> = post => {
	return (
		<div className="w-[50%]">
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 rounded-md md:max-w-[65vw]">
				<h1 className="text-2xl font-bold">{post.title}</h1>
				<p className="text-xl text-center">{post.content}</p>
				<br />

				<div className="flex flex-col items-center justify-center">
					<h2 className="text-xl font-bold">Author</h2>
					<p className="text-lg">{post.authorName}</p>
					<div className="rounded-full overflow-hidden">
						<Image src={getImage(post.authorImage)} alt="User Image" width={100} height={100} />
					</div>
				</div>
				<p>{post.createdAt.toDateString()} </p>
				<div className="flex flex-row items-center justify-center hover:cursor-pointer">
					<LikesComp postId={post.id} />
				</div>
				<Link
					href={`/groups/${post.groupId}`}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					View Group
				</Link>
			</div>
		</div>
	);
};

export default PostPage;
