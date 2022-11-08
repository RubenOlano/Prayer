import Link from "next/link";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	name: string;
	description?: string | null;
	groupId: string;
}

export const GroupTitle: FC<Props> = ({ name, description, groupId }) => {
	const { data, isLoading } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });

	const utils = trpc.useContext();

	const goToAdmin = async () => {
		await utils.groups.getGroup.prefetch({ id: groupId });
		await utils.groups.fetchGroupAdmins.prefetch({ groupId });
		await utils.groups.fetchGroupNonAdmins.prefetch({ groupId });
		await utils.groups.fetchUserIsAdmin.prefetch({ groupId });
	};

	return (
		<div className="p-2 md:p-5 flex flex-row justify-between">
			<div>
				<h1 className="md:text-2xl text-sm stroke-gray-800 font-bold ">{name}</h1>
				<p className="md:text-sm text-xs text-gray-500">{description || ""}</p>
			</div>
			{!isLoading && data && (
				<Link
					href={`/groups/${groupId}/admin`}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 md:p-4 rounded"
					onClick={goToAdmin}
				>
					Admin
				</Link>
			)}
		</div>
	);
};
