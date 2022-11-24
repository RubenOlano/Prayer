import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { trpc } from "../utils/trpc";
import { Plus, Share } from "./Icons";
import PostCard from "./PostCard";
import RefreshPosts from "./RefreshPosts";

const PrayerSection = () => {
	const groupId = useRouter().query.groupId as string;
	const { data, isLoading, fetchNextPage, hasNextPage } = trpc.posts.getGroupPosts.useInfiniteQuery(
		{ groupId },
		{
			getNextPageParam: lastPage => lastPage.nextCursor,
		}
	);

	return (
		<div className="align-middle text-center pb-40">
			<div className="btn-group">
				<Link href={`/posts/create?groupId=${groupId}`} className="btn" aria-label="Create a new post">
					<Plus dimensions={20} />
				</Link>
				<RefreshPosts />
				<Link href={`/groups/${groupId}/share`} className="btn" aria-label="Share posts from this group">
					<Share dimensions={15} />
				</Link>
			</div>
			<div className="md:grid md:grid-cols-3">
				{isLoading
					? Array.from({ length: 10 }).map((_, i) => <PostCard.Skeleton key={i} />)
					: data?.pages?.map((page, i) => (
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
