import { Group } from "@prisma/client";
import Link from "next/link";
import { trpc } from "../utils/trpc";

interface Props {
	group: Group;
}

function GroupItem({ group }: Props) {
	const utils = trpc.useContext();
	return (
		<Link
			href={`/groups/${group.id}`}
			className="card card-bordered bg-info hover:bg-secondary-focus"
			onClick={async () => {
				await utils.groups.getGroup.prefetch({ id: group.id });
			}}
		>
			<div className="card-body">
				<h2 className="card-title">{group.name}</h2>
				<p className="card-content">{group.description}</p>
			</div>
		</Link>
	);
}

export default GroupItem;

GroupItem.Skeleton = function GroupItemSkeleton() {
	return (
		<div className="card card-bordered bg-info hover:bg-secondary-focus animate-pulse">
			<div className="card-body">
				<h2 className="card-title" />
				<p className="card-content" />
			</div>
		</div>
	);
};
