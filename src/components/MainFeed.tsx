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

  if ((data?.pages.length === 0 || data?.pages[0]?.posts.length === 0) && !isLoading) {
    return (
      <div className="container justify-center text-center m-5">
        <h1 className="text-2xl">No posts yet</h1>
        <p className="text-base-content">Be the first one to share something</p>
      </div>
    );
  }

  return (
    <div className="container justify-center text-center">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <PostCard.Skeleton key={i} />)
        : data?.pages.map((page, i) => (
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
