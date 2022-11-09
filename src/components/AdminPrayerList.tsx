import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";
import { X } from "./Icons";
import PostCard from "./PostCard";

const AdminPrayerList = () => {
	const utils = trpc.useContext();
	const groupId = useRouter().query.groupId as string;
	const { data, isLoading } = trpc.posts.getGroupPosts.useInfiniteQuery({ groupId });
	const { mutate } = trpc.posts.deletePost.useMutation({
		onSuccess: async () => {
			await utils.posts.getGroupPosts.refetch({ groupId });
		},
		onMutate: async data => {
			utils.posts.getGroupPosts.setData(
				prev => {
					if (!prev) return { posts: [], nextCursor: undefined };
					const newPosts = prev.posts.filter(post => post.id !== data.postId);
					return { posts: newPosts, nextCursor: prev.nextCursor };
				},
				{ groupId }
			);
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
				Loading...
			</div>
		);
	}
	if ((!data && !isLoading) || !data.pages) {
		return (
			<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
				No prayers found
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{data.pages.map(page =>
				page.posts?.map(prayer => (
					<div key={prayer.id} className="flex flex-row">
						<button className="hover:bg-gray-200 rounded-md" onClick={() => mutate({ postId: prayer.id })}>
							<X dimensions={10} />
						</button>
						<div className="w-full">
							<PostCard key={prayer.id} {...prayer} />
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default AdminPrayerList;
