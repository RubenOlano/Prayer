import { PostComment, User } from "@prisma/client";
import Image from "next/image";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	comment: PostComment & {
		author: User;
	};
}

function Comment({ comment }: Props) {
	return (
		<div className="flex flex-col rounded-xl p-5 border-accent my-3 border-2 bg-neutral text-neutral-content">
			<h2 className="text-sm font-bold">{comment.content}</h2>
			<div className="flex flex-row py-2">
				<Image
					src={getImage(comment.author.image)}
					height={20}
					width={20}
					alt={comment.author.name || "Commenter"}
					className="avatar rounded-full"
				/>
				<p className="text-sm italic pl-2">{comment.author.name}</p>
			</div>
		</div>
	);
}

export default Comment;

Comment.Skeleton = function CommentSkeleton() {
	return (
		<div className="flex flex-col rounded-xl p-5 border-accent my-3 border-2 bg-neutral text-neutral-content">
			<h2 className="text-sm font-bold" />
			<div className="flex flex-row py-2">
				<Image
					src={getImage()}
					height={20}
					width={20}
					alt={"Commenter"}
					className="avatar rounded-full -z-10"
				/>
				<p className="text-sm italic pl-2" />
			</div>
		</div>
	);
};
