import { FC } from "react";
import AdminRegUsers from "./AdminRegUsers";
import AdminUsers from "./AdminUsers";

interface Props {
  userId: string;
  groupId: string;
}

const AdminUserList: FC<Props> = ({ groupId }) => {
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 overflow-hidden max-h-50 p-3">
        <h2 className="text-center text-2xl font-bold">Group Members</h2>
        <div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
          <p>Users</p>
          <AdminRegUsers groupId={groupId} />
          <br />
          <p>Admins</p>
          <AdminUsers groupId={groupId} />
        </div>
      </div>
    </>
  );
};

export default AdminUserList;
