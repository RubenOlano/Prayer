import { GroupMember } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	user: GroupMember & {
		User: {
			name: string | null;
			image?: string | null;
			id: string;
		};
	};
}

const UserComp: FC<Props> = ({ user }) => {
	return (
		<div className="flex flex-row items-center justify-center m-2">
			<Image
				src={getImage(user.User.image)}
				alt={`${user.User.name} ${user.User.name}`}
				width={30}
				height={30}
				className="rounded-full avatar"
			/>
			<h1 className="text-center ml-2">{user.User.name || "Member"}</h1>
		</div>
	);
};

export default UserComp;
