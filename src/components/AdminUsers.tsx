import { FC } from "react";
import { trpc } from "../utils/trpc";
import AdminComp from "./AdminComp";

interface Props {
	groupId: string;
}

const AdminUsers: FC<Props> = ({ groupId }) => {
	const { data, isLoading } = trpc.groups.fetchGroupAdmins.useQuery({ groupId });

	if (isLoading) {
		return (
			<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
				Loading...
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
				No users found
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
			{data.map(member => (
				<AdminComp key={member.id} admin={member} />
			))}
		</div>
	);
};

export default AdminUsers;
