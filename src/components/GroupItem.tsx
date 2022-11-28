import { Group } from "@prisma/client";
import Link from "next/link";

interface Props {
	group: Group;
}

function GroupItem({ group }: Props) {
	return (
		<Link
			href={`/groups/${group.id}`}
			className="card card-bordered bg-info hover:scale-105 transition text-info-content"
		>
			<div className="card-body ">
				<h2 className="card-title  text-info-content">{group.name}</h2>
				<p className="card-content  text-info-content">{group.description}</p>
			</div>
		</Link>
	);
}

export default GroupItem;

GroupItem.Skeleton = function GroupItemSkeleton() {
	return (
		<div className="card card-bordered bg-info hover:bg-secondary-focus animate-pulse">
			<div className="card-body animate-pulse">
				<h2 className="card-title" />
				<p className="card-content" />
			</div>
		</div>
	);
};
