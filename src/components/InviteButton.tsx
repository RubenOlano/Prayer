import { FC, useState } from "react";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
	userId: string;
}
const InviteButton: FC<Props> = ({ groupId, userId }) => {
	const [text, setText] = useState("Generate Invite Link");
	const { mutate } = trpc.useMutation("invites.createInvite", {
		onSuccess: async (res) => {
			// Copy Invite Link to clipboard
			if (res) {
				if ("clipboard" in navigator) {
					await navigator.clipboard.writeText(
						`${window.location.origin}/invites/${res}`
					);
				} else {
					document.execCommand(
						"copy",
						false,
						`${window.location.origin}/invites/${res}`
					);
				}
				setText("Copied to clipboard!");
				setTimeout(() => {
					setText("Generate Invite Link");
				}, 4000);
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
			{text}
		</button>
	);
};

export default InviteButton;
