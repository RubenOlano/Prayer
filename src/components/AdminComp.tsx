import { GroupAdmins } from "@prisma/client";
import Image from "next/image";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	admin: GroupAdmins;
}

const x = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 100" className="h-6 w-6" fill="gray" stroke="currentColor">
		<path d="M0 0 6 0 0 6-6 0 0 0" fill="currentColor" transform="translate(175) scale(10)" />
	</svg>
);

function AdminComp({ admin }: Props) {
	const utils = trpc.useContext();
	const { data: user, isLoading: loadUser } = trpc.users.getUser.useQuery({ id: admin.userId });

	const { mutate, isLoading } = trpc.groups.removeGroupAdmin.useMutation({
		onSuccess: async () => {
			await utils.groups.fetchGroupAdmins.refetch({ groupId: admin.groupId });
		},
	});
	if (loadUser) {
		return <AdminComp.Skeleton />;
	}

	if (!user) {
		return null;
	}

	return (
		<div className="flex flex-row items-center justify-center m-2">
			<Image
				src={getImage(user.image)}
				alt={user.name || "Member"}
				width={30}
				height={30}
				className="rounded-full avatar"
			/>
			<h1 className="text-center ml-2">{user.name || "Member"}</h1>
			<button
				className={`btn btn-error btn-xs ${isLoading && "disabled"}`}
				onClick={() => {
					mutate({ adminId: admin.id });
				}}
			>
				{x}
			</button>
		</div>
	);
}

export default AdminComp;

AdminComp.Skeleton = function AdminCompSkeleton() {
	return (
		<div className="flex flex-row items-center justify-center m-2">
			<Image src={getImage()} alt={"Member"} width={30} height={30} className="rounded-full avatar" />
			<h1 className="text-center ml-2">{"Member"}</h1>
			<button className={`btn btn-error btn-xs disabled`}>{x}</button>
		</div>
	);
};
