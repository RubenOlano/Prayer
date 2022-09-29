import { GroupMember, User } from "@prisma/client";
import { FC } from "react";
import UserComp from "./UserComp";

interface Props {
  members: (GroupMember & { User: User })[];
}

const MemberList: FC<Props> = ({ members }) => {
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 overflow-hidden max-h-50 p-3">
        <h2 className="text-center text-2xl font-bold flex">Group Members</h2>
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
