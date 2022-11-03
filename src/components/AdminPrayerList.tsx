import { FC } from "react";
import { trpc } from "../utils/trpc";
import AdminRequests from "./AdminRequests";

interface Props {
	groupId: string;
}
const AdminPrayerList: FC<Props> = ({ groupId }) => {
	const { data, isLoading } = trpc.posts.getGroupPosts.useQuery({ groupId: groupId as string });

	if (isLoading) return <div>Loading...</div>;
	if ((!data || data.privatePosts.length === 0 || data.pubPosts.length === 0) && !isLoading) {
		return (
			<div className="flex flex-col items-center justify-center m-5">
				<h2 className="text-center text-2xl font-bold flex">No prayer requests yet</h2>
				<p className="text-center text-xl flex">Be the first to add a request!</p>
			</div>
		);
	} else {
		return (
			<>
				<AdminRequests {...data} />
			</>
		);
	}
};

export default AdminPrayerList;
