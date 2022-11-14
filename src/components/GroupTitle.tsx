import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";
import { Plus } from "./Icons";
import RefreshPosts from "./RefreshPosts";

interface Props {
	name: string;
	description?: string | null;
	groupId: string;
}

export function GroupTitle({ name, description, groupId }: Props) {
	const { data, isLoading } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId });

	const utils = trpc.useContext();

	const goToAdmin = async () => {
		await utils.groups.getGroup.prefetch({ id: groupId });
		await utils.groups.fetchGroupAdmins.prefetch({ groupId });
		await utils.groups.fetchGroupNonAdmins.prefetch({ groupId });
	};

	return (
		<div className="navbar p-5 bg-base-200">
			<div className="navbar-start ">
				<div className="flex flex-col">
					<h1 className="md:text-2xl text-sm font-bold ">{name}</h1>
					{description && <p className="md:text-sm text-xs">{description}</p>}
				</div>
			</div>
			<div className="navbar-end">
				<Link href={`/posts/create?groupId=${groupId}`} className="btn">
					<Plus dimensions={20} />
				</Link>
				<RefreshPosts />
				{!isLoading && data && (
					<Link href={`/groups/${groupId}/admin`} className="btn btn-primary" onClick={goToAdmin}>
						Admin
					</Link>
				)}
			</div>
		</div>
	);
}

GroupTitle.Skeleton = function GroupTitleSkeleton() {
	return (
		<div className="navbar p-5 bg-base-200 animate-pulse">
			<div className="navbar-start ">
				<div className="flex flex-col">
					<h1 className="md:text-2xl text-sm font-bold " />
					<p className="md:text-sm text-xs" />
				</div>
			</div>
			<div className="navbar-end">
				<div className="btn">
					<Plus dimensions={20} />
				</div>
				<RefreshPosts />
			</div>
		</div>
	);
};
