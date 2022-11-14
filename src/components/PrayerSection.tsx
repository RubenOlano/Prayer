import React, { FC, Fragment } from "react";
import { trpc } from "../utils/trpc";
import PostCard from "./PostCard";

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
		<div className="align-middle text-center pb-40">
			<div className="md:grid md:grid-cols-3">
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
