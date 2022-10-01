import { FC } from "react";
import AdminPrayerList from "./AdminPrayerList";

interface Props {
  groupId: string;
}

const AdminPosts: FC<Props> = ({ groupId }) => {
  return (
    <div className=" backdrop-sepia-0 rounded-sm bg-white/75 overflow-hidden">
      <h2 className="justify-center text-2xl font-bold flex mb-3">
        Prayer Requests
      </h2>
      <AdminPrayerList groupId={groupId} />
    </div>
  );
};

export default AdminPosts;
