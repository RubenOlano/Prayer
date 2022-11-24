import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";

export function GroupTitle() {
	const id = useRouter().query.groupId as string;
	const { data, isLoading } = trpc.groups.getGroup.useQuery({ id });
	const { data: isAdmin } = trpc.groups.fetchUserIsAdmin.useQuery({ groupId: id });

	return (
		<div className="navbar p-5 bg-base-200">
			<div className="navbar-start ">
				<div className={`flex flex-col ${isLoading && "animate-pulse"}`}>
					<h1 className="md:text-2xl text-sm font-bold ">{data?.name || "Loading..."}</h1>
					{data?.description && <p className="md:text-sm text-xs">{data.description}</p>}
				</div>
			</div>
			<div className="navbar-end">
				{!isLoading && isAdmin && (
					<Link href={`/groups/${id}/admin`} className="btn btn-primary">
						Admin
					</Link>
				)}
			</div>
		</div>
	);
}
