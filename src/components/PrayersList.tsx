import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import PrayerRequest from "./PrayerRequest";

const PrayersList = () => {
	const router = useRouter();
	const groupId = router.query.groupId as string;

	const { data, isLoading } = trpc.posts.getGroupPosts.useQuery({ groupId });

	if (isLoading) return <div>Loading...</div>;
	if ((!data || data.privatePosts.length === 0) && (!data || data.pubPosts.length === 0)) {
		return (
			<>
				<h2 className="text-lg md:text-2xl">No prayer requests yet</h2>
				<p className="text-sm gray-500 md:text-xl">Be the first to add a request!</p>
			</>
		);
	} else {
		return <PrayerRequest anon={data.privatePosts} regPosts={data.pubPosts} />;
	}
};

export default PrayersList;
