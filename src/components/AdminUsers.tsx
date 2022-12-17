import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import AdminComp from "./AdminComp";

function AdminUsers() {
  const groupId = useRouter().query.groupId as string;
  const { data, isLoading } = trpc.groups.fetchGroupAdmins.useQuery({ groupId });

  if (!data && !isLoading) {
    return (
      <div className="flex flex-col flex-wrap justify-center items-center overflow-y-scroll max-h-[50vh]">
        No users found
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex flex-col">
          {Array.from({ length: 2 }).map((_, i) => (
            <AdminComp.Skeleton key={i} />
          ))}
        </div>
      ) : (
        data.map(member => <AdminComp key={member.id} admin={member} />)
      )}
    </div>
  );
}

export default AdminUsers;
