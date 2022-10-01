import { GroupMember } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
  member: GroupMember;
}

const AdminComp: FC<Props> = ({ member }) => {
  const { data: user } = trpc.useQuery([
    "users.getUser",
    { id: member.userId },
  ]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-center m-2">
      <Image
        src={
          user?.image ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
        }
        alt={`${user.fname} ${user.lname}`}
        width={30}
        height={30}
        className="rounded-full"
      />
      <h1 className="text-cente ml-2">
        {user.fname} {user.lname}
      </h1>
      <button className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 350 100"
          className="h-6 w-6"
          fill="gray"
          stroke="currentColor"
        >
          <path
            d="M0 0 6 0 0 6-6 0 0 0"
            fill="currentColor"
            transform="translate(175) scale(10)"
          />
        </svg>
      </button>
    </div>
  );
};

export default AdminComp;
