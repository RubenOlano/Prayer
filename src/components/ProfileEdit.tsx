import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import UpdateName from "./UpdateName";
import UpdateImage from "./UpdateImage";

const ProfileEdit = () => {
	const { data: session } = useSession();
	if (!session || !session.user) {
		return <div>Not signed in</div>;
	}
	const { data: user, isLoading } = trpc.users.getUser.useQuery({ id: session.user.id });

	if (isLoading) {
		return (
			<div className="text-center rounded-sm md:py-5 px-2 ">
				<h1 className="text-lg md:text-2xl font-bold m-2">Profile Edit</h1>
				<div className="flex flex-col justify-center items-center animate-pulse">
					<UpdateImage.Skeleton />
					<div className="flex flex-col justify-center items-center m-3">
						<h2 className="text-lg" />
						<UpdateName.Skeleton />
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div className="text-center rounded-sm md:py-5 px-2">
			<h1 className="text-lg md:text-2xl font-bold m-2">Profile Edit</h1>
			<div className="flex flex-col justify-center items-center">
				<UpdateImage user={user} />
				<div className="flex flex-col justify-center items-center m-3">
					<h2 className="text-lg">{user.name ? user.name : "No Name Set"}</h2>
					<UpdateName userId={user.id} />
				</div>
			</div>
		</div>
	);
};

export default ProfileEdit;
