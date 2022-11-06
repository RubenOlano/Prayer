import { Fragment } from "react";
import { trpc } from "../utils/trpc";
import PostCard from "./PostCard";

const MainFeed = () => {
	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = trpc.posts.getPostFeed.useInfiniteQuery(
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
			<div className="w-8/12 justify-center m-auto">
				{data?.pages.map((page, i) => (
					<Fragment key={i}>
						{page.posts.map(post => (
							<PostCard key={post.id} {...post} />
						))}
					</Fragment>
				))}
			</div>
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
		</>
	);
};

export default MainFeed;
