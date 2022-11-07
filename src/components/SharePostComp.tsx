import React, { FC } from "react";

interface Props {
	onSelect: (id: string) => void;
	content: string;
	authorName: string | null;
	groupName: string;
	title: string;
	id: string;
	createdAt: Date;
	groupId: string;
	authorImage: string | undefined;
}

const SharePostComp: FC<Props> = ({ onSelect, ...post }) => {
	return (
		<div className="flex items-center p-2 border-y-2 border-gray-200">
			<input className="m-3" type="checkbox" onChange={() => onSelect(post.id)} />
			<div className="p-2 rounded-md bg-blue-700 bg-opacity-50 backdrop-filter backdrop-blur-md w-full">
				<p className="text-sm truncate">{post.content}</p>
				<p className="text-xs text-gray-500">{post.authorName || "Anonymous"}</p>
			</div>
		</div>
	);
};

export default SharePostComp;
