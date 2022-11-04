import Link from "next/link";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	name: string;
	description?: string | null;
	groupId: string;
}

export const GroupTitle: FC<Props> = ({ name, description, groupId }) => {
	const { data } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });
	return (
		<div className="p-5 flex flex-row justify-between">
			<div className="">
				<h1 className="text-2xl stroke-gray-800 font-bold ">{name}</h1>
				<p className=" text-sm text-gray-500">{description || ""}</p>
			</div>
			{data && (
				<Link
					href={`/groups/${groupId}/admin`}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded"
				>
					Admin
				</Link>
			)}
		</div>
	);
};
