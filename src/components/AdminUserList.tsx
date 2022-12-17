import AdminRegUsers from "./AdminRegUsers";
import AdminUsers from "./AdminUsers";

const AdminUserList = () => {
  return (
    <div className="flex flex-col items-center p-5 md:w-1/2">
      <div className="bg-base-300 rounded-sm p-5">
        <h2 className="text-center text-base md:text-2xl font-extrabold">Group Members</h2>
        <div className="flex flex-col justify-center">
          <p className="text-center text-sm md:text-xl font-bold">Users</p>
          <AdminRegUsers />
          <br />
          <p className="text-center text-sm md:text-xl font-bold">Admins</p>
          <AdminUsers />
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
