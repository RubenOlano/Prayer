import { GroupMember } from "@prisma/client";
import { FC } from "react";
import UserComp from "./UserComp";

interface Props {
	members: (GroupMember & {
		User: {
			name: string | null;
			image: string | null;
			id: string;
		};
	})[];
}

const MemberList: FC<Props> = ({ members }) => {
	return (
		<>
			<div className="backdrop-sepia-0 rounded-sm bg-white/75 p-3 justify-center">
				<h2 className="text-center text-2xl font-bold">
					Group Members
				</h2>
				<div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
					{members.map((member) => (
						<UserComp key={member.id} user={member} />
					))}
				</div>
			</div>
		</>
	);
};

export default MemberList;
