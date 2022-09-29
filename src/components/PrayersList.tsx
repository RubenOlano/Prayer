import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import PrayerRequest from "./PrayerRequest";

const PrayersList = () => {
  const router = useRouter();
  const res = router.query;
  const groupId = res.groupId;

  const { data, isLoading } = trpc.useQuery([
    "posts.getGroupPosts",
    { groupId: groupId as string },
  ]);
  const { data: anonPosts } = trpc.useQuery([
    "posts.getAnonPosts",
    { groupId: groupId as string },
  ]);

  if (isLoading) return <div>Loading...</div>;
  if ((!data || data.length < 1) && (!anonPosts || anonPosts.length < 1)) {
    return (
      <div className="flex flex-col items-center justify-center m-5">
        <h2 className="text-center text-2xl font-bold flex">
          No prayer requests yet
        </h2>
        <p className="text-center text-xl flex">
          Be the first to add a request!
        </p>
      </div>
    );
  } else {
    return (
      <>
        <PrayerRequest anon={anonPosts} regPosts={data} />
      </>
    );
  }
};

export default PrayersList;
