import { FC } from "react";
import AdminPrayerList from "./AdminPrayerList";

interface Props {
	groupId: string;
}

const AdminPosts: FC<Props> = () => {
	return (
		<div className=" rounded-sm  p-2">
			<h2 className="justify-center text-base md:text-2xl font-bold flex mb-3">Prayer Requests</h2>
			<AdminPrayerList />
		</div>
	);
};

export default AdminPosts;
