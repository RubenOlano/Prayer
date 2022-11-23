import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";
import AdminPostCard from "./AdminPostCard";

function AdminPrayerList() {
	const groupId = useRouter().query.groupId as string;
	const { data, isLoading } = trpc.posts.getGroupPosts.useInfiniteQuery({ groupId });

	return (
		<div className="flex flex-col pb-40 w-full">
			{isLoading ? (
				<div className="flex flex-col pb-40 w-full">
					{Array.from({ length: 10 }).map((_, i) => (
						<AdminPostCard.Skeleton key={i} />
					))}
				</div>
			) : (
				data?.pages?.map(page => page.posts?.map(prayer => <AdminPostCard key={prayer.id} {...prayer} />))
			)}
		</div>
	);
}

export default AdminPrayerList;
