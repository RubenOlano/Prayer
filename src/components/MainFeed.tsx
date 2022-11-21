import { Fragment } from "react";
import { trpc } from "../utils/trpc";
import PostCard from "./PostCard";

const MainFeed = () => {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = trpc.posts.getPostFeed.useInfiniteQuery(
		{
			limit: 5,
		},
		{
			getNextPageParam: lastPage => {
				return lastPage.cursor;
			},
		}
	);

	if (isLoading) {
		return (
			<div className="container justify-center text-center">
				{Array.from({ length: 5 }).map((_, i) => (
					<PostCard.Skeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="container justify-center text-center">
			{data?.pages.map((page, i) => (
				<Fragment key={i}>
					{page.posts.map(post => (
						<PostCard key={post.id} {...post} />
					))}
				</Fragment>
			))}
			{isFetchingNextPage && Array.from({ length: 2 }).map((_, i) => <PostCard.Skeleton key={i} />)}
			{!isLoading && (
				<button
					onClick={() => fetchNextPage()}
					disabled={!hasNextPage || isFetchingNextPage}
					className={`text-center ${
						hasNextPage ? "hover:bg-opacity-75 bg-secondary btn" : "btn btn-disabled btn-secondary"
					}`}
				>
					{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
				</button>
			)}
		</div>
	);
};

export default MainFeed;
