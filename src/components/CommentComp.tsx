import { PostComment, User } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	comment: PostComment & {
		author: User;
	};
}

const Comment: FC<Props> = ({ comment }) => {
	return (
		<div className="flex flex-col rounded-sm bg-white/75 m-2 p-3 w-full ">
			<h2 className="text-sm font-bold">{comment.content}</h2>
			<div className="flex flex-row py-2">
				<Image
					src={getImage(comment.author.image)}
					height={20}
					width={20}
					alt={comment.author.name || "Commenter"}
					className="rounded-full"
				/>
				<p className="text-sm italic pl-2">{comment.author.name}</p>
			</div>
		</div>
	);
};

export default Comment;
