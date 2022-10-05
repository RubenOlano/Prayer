import { FC, useState } from "react";
import { iosDetect } from "../utils/checkIOS";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
	userId: string;
}
const InviteButton: FC<Props> = ({ groupId, userId }) => {
	const [text, setText] = useState("Generate Invite Link");
	const { mutate } = trpc.useMutation("invites.createInvite", {
		onSuccess: async (res) => {
			if (res) {
				setText("Loading...");
				// Check if client is on IOS
				if (iosDetect()) {
					// Use iOS share sheet
					await navigator.share({
						title: "Invite Link",
						text: `${window.location.origin}/invites/${res}`,
					});
				} else {
					const clipText = new ClipboardItem({
						"text/plain": new Blob(
							[`${window.location.origin}/invites/${res.id}`],
							{ type: "text/plain" }
						),
					});
					await navigator.clipboard.write([clipText]);
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
