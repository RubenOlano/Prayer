import { GroupMember } from "@prisma/client";
import { FC } from "react";
import Image from "next/image";

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
        src={
          user.User.image ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
        }
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
