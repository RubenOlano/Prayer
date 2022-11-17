import Image from "next/image";
import Link from "next/link";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";
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

function PostPage(post: Props) {
	const util = trpc.useContext();
	return (
		<div className="md:w-[50%] card card-normal justify-center text-center bg-base-300">
			<div className="card-title justify-center flex-col">
				<h1 className="md:text-2xl font-bold text-center">{post.title}</h1>
				<p className="md:text-xl text-sm text-center">{post.content}</p>
			</div>
			<br />
			<div className="card-body justify-center">
				<h2 className="text-sm md:text-xl font-bold">Author</h2>
				<p className="text-base md:text-lg">{post.authorName}</p>
				<Image
					src={getImage(post.authorImage)}
					alt="User Image"
					width={40}
					height={40}
					className="md:h-24 md:w-24 avatar rounded-full self-center"
				/>
			</div>
			<p>{post.createdAt.toDateString()} </p>
			<div className="flex flex-row items-center justify-center hover:cursor-pointer">
				<LikesComp postId={post.id} />
			</div>
			<Link
				href={`/groups/${post.groupId}`}
				className="btn btn-primary"
				onClick={async () => {
					await util.groups.getGroup.prefetch({ id: post.groupId });
				}}
			>
				View Group
			</Link>
		</div>
	);
}

export default PostPage;

PostPage.Skeleton = function PostPageSkeleton() {
	return (
		<div className="md:w-[50%] card card-normal justify-center text-center animate-pulse bg-base-300">
			<div className="card-title justify-center">
				<h1 className="md:text-2xl font-bold text-center" />
				<p className="md:text-xl text-sm text-center" />
			</div>
			<div className="card-body justify-center">
				<h2 className="text-sm md:text-xl font-bold">Author</h2>
				<p className="text-base md:text-lg" />
			</div>
			<p />
			<button className="btn btn-primary">View Group</button>
		</div>
	);
};
