import { FC } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
	userId: string;
}
const InviteButton: FC<Props> = ({ groupId, userId }) => {
	const { mutate } = trpc.useMutation("invites.createInvite", {
		onSuccess: (res) => {
			// Copy Invite Link to clipboard
			if (res) {
				navigator.clipboard.writeText(
					`${window.location.origin}/invites/${res.id}`
				);
			}
		},
	});
	const onClick = () => {
		mutate({ groupId, userId });
	};
	return (
		<button
			className="ml-2 bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded"
			onClick={onClick}
		>
			Generate Invite Link
		</button>
	);
};

export default InviteButton;
