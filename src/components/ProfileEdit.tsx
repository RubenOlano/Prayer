import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import UpdateName from "./UpdateName";

const UpdateImage = dynamic(() => import("./UpdateImage"));
2;

const ProfileEdit = () => {
	const { data: session } = useSession();
	if (!session || !session.user) {
		return <div>Not signed in</div>;
	}

	const { user } = session;

	return (
		<div className="md:col-start-2 md:col-end-2 text-center bg-white/70 rounded-sm md:py-5 px-2">
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
