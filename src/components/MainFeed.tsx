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

	return (
		<>
			<div className="md:w-8/12 justify-center md:m-auto">
				{data?.pages.map((page, i) => (
					<Fragment key={i}>
						{page.posts.map(post => (
							<PostCard key={post.id} {...post} />
						))}
					</Fragment>
				))}
			</div>
			{!isLoading && (
				<div className="flex justify-center items-center">
					<button
						onClick={() => fetchNextPage()}
						disabled={!hasNextPage || isFetchingNextPage}
						className={`text-white rounded-lg p-2 m-2 flex flex-col items-center ${
							hasNextPage ? "hover:bg-opacity-75 bg-black" : "bg-slate-600"
						}`}
					>
						{isFetchingNextPage ? "Loading more..." : hasNextPage ? "Load More" : "Nothing more to load"}
					</button>
				</div>
			)}
		</>
	);
};

export default MainFeed;
