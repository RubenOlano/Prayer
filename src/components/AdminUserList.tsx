import AdminRegUsers from "./AdminRegUsers";
import AdminUsers from "./AdminUsers";

const AdminUserList = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center rounded-sm">
				<h2 className="text-center text-base md:text-2xl font-bold">Group Members</h2>
				<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll md:max-h-[50vh]">
					<p className="text-center text-sm md:text-xl font-bold">Users</p>
					<AdminRegUsers />
					<br />
					<p className="text-center text-sm md:text-xl font-bold">Admins</p>
					<AdminUsers />
				</div>
			</div>
		</>
	);
};

export default AdminUserList;
