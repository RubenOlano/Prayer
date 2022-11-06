import { FC } from "react";
import { iosDetect } from "../utils/checkIOS";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
	userId: string;
}
const InviteButton: FC<Props> = ({ groupId, userId }) => {
	const { mutate, isLoading, isSuccess } = trpc.invites.createInvite.useMutation({
		onSuccess: async ({ id }) => {
			if (iosDetect(window.navigator)) {
				// Get base url if on ios
				if (window !== undefined) {
					const baseUrl = window.location.origin;
					await navigator.share({
						title: "Group Pray",
						text: `Join my group on Group Pray!`,
						url: `${baseUrl}/invites/${id}`,
					});
				} else {
					// If window is undefined, then on ios safari and can't use window.location.origin
					await navigator.share({
						title: "Group Pray",
						text: `Join my group on Group Pray!`,
						url: `https://group-pray.vercel.app/invites/${id}`,
					});
				}
			} else {
				const inviteLink = window.location.origin + "/invites/" + id;
				const clipText = new ClipboardItem({
					"text/plain": new Blob([inviteLink], {
						type: "text/plain",
					}),
				});
				await navigator.clipboard.write([clipText]);
			}
		},
	});
	const onClick = () => {
		mutate({ groupId, userId });
	};
	return (
		<button
			className={`ml-2 bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded ${
				isLoading ? "opacity-50 cursor-not-allowed" : ""
			}`}
			onClick={onClick}
		>
			{isSuccess ? "Copied to Clipboard!" : "Generate Invite Link"}
		</button>
	);
};

export default InviteButton;
