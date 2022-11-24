import { Group, GroupAdmins, GroupMember, User } from "@prisma/client";
import Image from "next/image";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";

interface Props {
	group: Group & {
		GroupAdmins: (GroupAdmins & {
			User: User;
		})[];
		GroupMembers: (GroupMember & {
			User: User;
		})[];
		_count: {
			GroupMembers: number;
		};
	};
}

function ExploreCards({ group }: Props) {
	const utils = trpc.useContext();
	const { mutate, isLoading, isSuccess } = trpc.groups.joinGroup.useMutation({
		onSuccess: async () => {
			await utils.groups.getGroups.invalidate();
			await utils.groups.getExploreGroups.invalidate();
		},
	});

	return (
		<div className="card bg-base-300 m-3 md:m-0">
			<div className="card-body">
				<div className="card-title">{group.name}</div>
				<div className="text-gray-500">{group.description}</div>
				<div className="text-gray-500">{`${group._count.GroupMembers} ${
					group._count.GroupMembers > 1 ? "members" : "member"
				}`}</div>
				<div>
					{group.GroupAdmins.map(admin => (
						<div key={admin.id}>
							<Image
								src={getImage(admin.User.image)}
								alt="Picture of the author"
								width={50}
								height={50}
								className="rounded-full avatar"
							/>
						</div>
					))}
				</div>
				<div className="card-actions justify-end" onClick={() => mutate({ groupId: group.id })}>
					<button className="btn btn-primary">
						{isLoading ? "Joining..." : isSuccess ? "Joined!" : "Join"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ExploreCards;

ExploreCards.Skeleton = function ExploreCardsSkeleton() {
	return (
		<div className="card bg-base-300 animate-pulse">
			<div className="card-body">
				<div className="card-title" />
				<div className="text-gray-500" />
				<div className="text-gray-500" />
				<div>
					<Image
						src={getImage()}
						alt="Picture of the author"
						width={50}
						height={50}
						className="rounded-full avatar"
					/>
				</div>
				<div className="card-actions justify-end">
					<button className="btn btn-primary disabled">Join</button>
				</div>
			</div>
		</div>
	);
};
