import Link from "next/link";
import React, { FC } from "react";
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

	return (
		<>
			{/* Two columns, one with posts 2/3 and other with refresh/add 1/3 */}
			<div className="grid grid-cols-3 align-middle">
				<div className="col-span-2">
					{isLoading ? (
						<div>Loading...</div>
					) : (
						<>
							{data?.pages.map(page => page.posts.map(post => <PostCard key={post.id} post={post} />))}
							{hasNextPage && (
								<button
									onClick={() => {
										fetchNextPage();
									}}
								>
									Load More
								</button>
							)}
						</>
					)}
				</div>
				<div className="justify-self-center justify-center col-span-1">
					<Link
						href={`/posts/create/${groupId}`}
						className="flex text-sm flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
					>
						<Plus dimensions={80} />
					</Link>
					<RefreshPosts />
				</div>
			</div>
		</>
	);
};

export default PrayerSection;
