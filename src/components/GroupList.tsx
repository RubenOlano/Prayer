import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import GroupItem from "./GroupItem";

interface Props {
	userId: string;
}

const GroupList: FC<Props> = ({ userId }) => {
	const [text, setText] = React.useState("Create Group");
	const router = useRouter();
	if (!userId) {
		signIn(undefined, { callbackUrl: "/groups" });
		return <div>Redirecting...</div>;
	}
	const { data, isLoading } = trpc.useQuery(["groups.getGroups", { userId }]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (data?.length == 0 && !isLoading) {
		return (
			<div className="text-center backdrop-sepia-0 bg-white/60 mx-3">
				<h2 className="text-lg md:text-2xl justify-center font-bold flex p-5">
					Groups
				</h2>
				<div className="overflow-y-scroll h-[55vh]">
					<button
						onClick={() => {
							setText("Loading...");
							router.push("/groups/create");
						}}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						{text}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col text-center backdrop-sepia-0 bg-white/60 px-12 pt-12 pb-5 ">
			<h2 className="text-2xl justify-center font-bold flex p-5">
				Groups
			</h2>
			<div className="overflow-scroll h-[55vh]">
				<button
					onClick={() => {
						setText("Loading...");
						router.push("/groups/create");
					}}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					{text}
				</button>
				{data?.map((group) => (
					<GroupItem key={group.id} group={group} />
				))}
			</div>
		</div>
	);
};

export default GroupList;
