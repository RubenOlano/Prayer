import React, { FC } from "react";

interface Props {
	groupTitle: string;
	groupDescription: string;
}

export const GroupTitle: FC<Props> = ({ groupTitle, groupDescription }) => {
	return (
		<div className="col-start-1 col-end-3 md:col-end-3 row-start-1 row-end-1">
			<h1 className="text-2xl stroke-gray-800 font-bold text-center">{groupTitle}</h1>
			<p className="text-center text-sm text-gray-500">{groupDescription}</p>
		</div>
	);
};
