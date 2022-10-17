import React, { FC } from "react";

interface Props {
	content: string;
	name: string;
}

const SharedPostsComp: FC<Props> = ({ content, name }) => {
	return (
		<div className="flex flex-col items-center justify-center border-y-2 border-black my-3 py-3 px-20">
			<div className="text-md ">{content}</div>
			<div className="text-sm">{name}</div>
		</div>
	);
};

export default SharedPostsComp;
