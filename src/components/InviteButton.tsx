import { FC, useState } from "react";
import { iosDetect } from "../utils/checkIOS";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
	userId: string;
}
const InviteButton: FC<Props> = ({ groupId, userId }) => {
	const [text, setText] = useState("Generate Invite Link");
	const { mutate } = trpc.invites.createInvite.useMutation({
		onSuccess: async ({ id }) => {
			setText("Loading...");
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
			setText("Copied to clipboard!");
			setTimeout(() => {
				setText("Generate Invite Link");
			}, 4000);
		},
	});
	const onClick = () => {
		mutate({ groupId, userId });
	};
	return (
		<button className="ml-2 bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded" onClick={onClick}>
			{text}
		</button>
	);
};

export default InviteButton;
