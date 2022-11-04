import React from "react";
import { trpc } from "../utils/trpc";
import PostCard from "./PostCard";

const MainFeed = () => {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.posts.getPostFeed.useInfiniteQuery(
		{
			limit: 10,
		},
		{
			getNextPageParam: lastPage => {
				return lastPage.cursor;
			},
		}
	);

	return (
		<>
			{data?.pages.map(page => (
				<>
					{page.posts.map(post => (
						<PostCard key={post.id} post={post} />
					))}
				</>
			))}
			<div className="flex justify-center items-center">
				<button
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
					className={`bg-black text-white rounded-lg p-2 m-2 flex flex-col items-center ${
						hasNextPage ? "hover:bg-opacity-75" : "bg-slate-600"
					}`}
				>
					{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
				</button>
			</div>
		</>
	);
};

export default MainFeed;
