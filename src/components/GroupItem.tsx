import { Group } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface Props {
	group: Group;
}

const GroupItem: FC<Props> = ({ group }) => {
	return (
		<Link
			href={`/groups/${group.id}`}
			className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25"
		>
			<h2 className="text-2xl font-bold text-center m-3">{group.name}</h2>
			<p className="italic font-bold text-center ">{group.description}</p>
		</Link>
	);
};

export default GroupItem;
