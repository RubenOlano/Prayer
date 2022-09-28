import { User } from "next-auth";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
  user: User;
}

const GroupList: FC<Props> = ({ user }) => {
  const router = useRouter();
  if (!user) {
    router.push("/auth/signin");
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
    <>
      {data?.map((group) => (
        <div key={group.id}>
          <h1>{group.name}</h1>
        </div>
      ))}
    </>
  );
};

export default GroupList;
