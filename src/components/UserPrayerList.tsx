import { FC } from "react";
import { trpc } from "../utils/trpc";
import PostItem from "./PostItem";

interface Props {
  userId: string;
}

const UserPrayerList: FC<Props> = ({ userId }) => {
  const { isLoading, data } = trpc.useQuery([
    "posts.getAuthorPosts",
    { userId },
  ]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">
      <h2 className="text-2xl justify-center font-bold flex pb-5">
        Your Requests
      </h2>
      <div className="overflow-scroll h-[55vh]">
        {data?.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default UserPrayerList;
