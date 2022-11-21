import { iosDetect } from "../utils/checkIOS";
import { trpc } from "../utils/trpc";

interface Props {
	groupId: string;
}
function InviteButton({ groupId }: Props) {
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
		mutate({ groupId });
	};
	return (
		<button
			className={`btn btn-success ${isLoading && "loading disabled"} ${isSuccess && "btn-ghost"}`}
			onClick={onClick}
		>
			{isSuccess ? "Copied!" : "Invite"}
		</button>
	);
}

export default InviteButton;

InviteButton.Skeleton = function InviteButtonSkeleton() {
	return <button className={`btn btn-success disabled btn-ghost`}>Invite</button>;
};
