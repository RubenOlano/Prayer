import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";
import InviteButton from "./InviteButton";

interface Props {
  groupId: string;
}

function AdminHeader({ groupId }: Props) {
  const utils = trpc.useContext();
  const router = useRouter();
  const deleteGroup = () => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (confirm) {
      mutate({ groupId });
    }
    return;
  };
  const { mutate, isLoading } = trpc.groups.deleteGroup.useMutation({
    onSuccess: async () => {
      await utils.groups.getGroups.invalidate();
      router.replace("/");
    },
  });
  return (
    <div className="btn-group min-w-screen flex justify-center">
      <Link className="btn btn-info" href={`/groups/${groupId}`}>
        Back
      </Link>
      <button className={`btn btn-error ${isLoading && "loading disabled"}`} onClick={deleteGroup}>
        {isLoading ? "Deleting..." : "Delete"}
      </button>
      <InviteButton groupId={groupId} />
    </div>
  );
}

export default AdminHeader;

AdminHeader.Skeleton = function AdminHeaderSkeleton() {
  return (
    <div className="btn-group min-w-screen flex justify-center">
      <div className="btn btn-info">Back</div>
      <button className={`btn btn-error disabled`}>Delete</button>
      <InviteButton.Skeleton />
    </div>
  );
};
