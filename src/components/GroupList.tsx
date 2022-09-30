import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";

interface Props {
  user: User;
}

const GroupList: FC<Props> = ({ user }) => {
  const router = useRouter();
  if (!user) {
    signIn(undefined, { callbackUrl: "/groups" });
    return <div>Redirecting...</div>;
  }
  const { data, isLoading } = trpc.useQuery([
    "groups.getGroups",
    { userId: user.id },
  ]);

  if (data?.length == 0 && !isLoading) {
    return (
      <div>
        <button
          onClick={() => router.push("/groups/create")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Group
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">
      <h2 className="text-2xl justify-center font-bold flex pb-5">Groups</h2>
      <div className="overflow-scroll h-[55vh]">
        {data?.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupList;