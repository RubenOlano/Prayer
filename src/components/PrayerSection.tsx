import Link from "next/link";
import React, { FC, Fragment } from "react";
import { trpc } from "../utils/trpc";
import { Plus, Share } from "./Icons";
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
			<div className="align-middle text-center pb-40">
				<div className="btn-group animate-pulse">
					<Link href={`/posts/create?groupId=${groupId}`} className="btn btn-disabled">
						<Plus dimensions={20} />
					</Link>
					<RefreshPosts.Skeleton />
					<Link href={`/groups/${groupId}/share`} className="btn btn-disabled">
						<Share dimensions={15} />
					</Link>
				</div>
				<div className="md:grid md:grid-cols-3">
					{Array.from({ length: 10 }).map((_, i) => (
						<PostCard.Skeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="p-5">
				<h1 className="p-5">No posts found</h1>
				<div className="btn-group">
					<Link href={`/posts/create?groupId=${groupId}`} className="btn">
						<Plus dimensions={20} />
					</Link>
					<RefreshPosts />
					<Link href={`/groups/${groupId}/share`} className="btn">
						<Share dimensions={15} />
					</Link>
				</div>
			</div>
		);
	}

	if (!data.pages) {
		console.log(data);

		return (
			<div className="p-5">
				<h1 className="p-5">No posts found</h1>
				<div className="btn-group">
					<Link href={`/posts/create?groupId=${groupId}`} className="btn">
						<Plus dimensions={20} />
					</Link>
					<RefreshPosts />
					<Link href={`/groups/${groupId}/share`} className="btn">
						<Share dimensions={15} />
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="align-middle text-center pb-40">
			<div className="btn-group">
				<Link href={`/posts/create?groupId=${groupId}`} className="btn">
					<Plus dimensions={20} />
				</Link>
				<RefreshPosts />
				<Link href={`/groups/${groupId}/share`} className="btn">
					<Share dimensions={15} />
				</Link>
			</div>
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
