import { useRouter } from "next/router";
import { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
  id: string;
}

const JoinExploreGroupButton: FC<Props> = ({ id }) => {
  const router = useRouter();
  const { isLoading, isSuccess, mutate } = trpc.groups.joinGroup.useMutation({
    onSuccess: () => router.push(`/group/${id}`),
  });
  return (
    <div className="card-actions justify-end" onClick={() => mutate({ groupId: id })}>
      <button className="btn btn-primary">{isLoading ? "Joining..." : isSuccess ? "Joined!" : "Join"}</button>
    </div>
  );
};

export default JoinExploreGroupButton;
