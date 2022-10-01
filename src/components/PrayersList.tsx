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
      <>
        <h2
          className="
          text-lg
          md:text-2xl
        "
        >
          No prayer requests yet
        </h2>
        <p
          className="
          text-sm
          gray-500
        md:text-xl
        "
        >
          Be the first to add a request!
        </p>
      </>
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
