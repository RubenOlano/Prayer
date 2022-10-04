import { GroupMember } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";
import { getImage } from "../utils/defaultUserImage";

interface Props {
  user: GroupMember & {
    User: {
      fname: string | null;
      lname: string | null;
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
        alt={`${user.User.fname} ${user.User.lname}`}
        width={30}
        height={30}
        className="rounded-full"
      />
      <h1 className="text-cente ml-2">
        {user.User.fname} {user.User.lname}
      </h1>
    </div>
  );
};

export default UserComp;
