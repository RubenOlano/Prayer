import { Post, User } from "@prisma/client";
import React, { FC } from "react";

interface Props {
	onSelect: (id: string) => void;
	post: Post & {
		author: User;
	};
}

const SharePostComp: FC<Props> = ({ onSelect, post }) => {
	return (
		<div className="flex items-center p-2 border-y-2 border-gray-200">
			<input className="m-3" type="checkbox" onChange={() => onSelect(post.id)} />
			<div className="p-2 rounded-md bg-blue-700 bg-opacity-50 backdrop-filter backdrop-blur-md w-full">
				<p className="text-sm truncate">{post.content}</p>
				<p className="text-xs text-gray-500">{`${post.anonymous ? "Anon" : post.author.name}`}</p>
			</div>
		</div>
	);
};

export default SharePostComp;
