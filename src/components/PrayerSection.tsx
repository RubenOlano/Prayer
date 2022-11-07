import Link from "next/link";
import React, { FC, Fragment } from "react";
import { trpc } from "../utils/trpc";
import { Plus } from "./Icons";
import PostCard from "./PostCard";
import RefreshPosts from "./RefreshPosts";

interface Props {
	groupId: string;
}

const PrayerSection: FC<Props> = ({ groupId }) => {
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.posts.getGroupPosts.useInfiniteQuery(
		{ groupId },
		{
			getNextPageParam: lastPage => lastPage.nextCursor,
		}
	);

	if (isLoading) {
		return (
			<div className="p-5">
				<h1 className="p-5">Loading...</h1>
			</div>
		);
	}

	if (!data || !data.pages) {
		return (
			<div className="p-5">
				<h1 className="p-5">No posts found</h1>
			</div>
		);
	}
	return (
		<div className="grid md:grid-cols-4 grid-flow-row  align-middle">
			<div className="justify-self-center justify-center md:col-span-1 flex flex-row md:flex-col md:block">
				<Link
					href={`/posts/create?groupId=${groupId}`}
					className="flex text-sm flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
				>
					<Plus dimensions={20} />
				</Link>
				<RefreshPosts />
			</div>
			<div className="md:col-span-3">
				{data.pages.map((page, i) => (
					<Fragment key={i}>
						{page.posts.map(post => (
							<PostCard key={post.id} {...post} />
						))}
					</Fragment>
				))}
				{hasNextPage && (
					<button
						onClick={() => {
							fetchNextPage();
						}}
					>
						Load More
					</button>
				)}
			</div>
		</div>
	);
};

export default PrayerSection;
