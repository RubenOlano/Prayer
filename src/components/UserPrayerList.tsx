import { FC } from "react";
import { trpc } from "../utils/trpc";
import PostItem from "./PostItem";

interface Props {
	userId: string;
}

const UserPrayerList: FC<Props> = ({ userId }) => {
	const { isLoading, data } = trpc.posts.getAuthorPosts.useQuery({ userId });
	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="flex flex-col text-center px-12 pt-12 pb-5 md:mx-3">
			<h2 className="text-2xl justify-center font-bold flex p-5">Your Requests</h2>
			<div className="overflow-y-scroll overflow-x-hidden h-[55vh]">
				{data?.map(post => (
					<PostItem key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};

export default UserPrayerList;
