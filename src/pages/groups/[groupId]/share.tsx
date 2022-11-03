import SharePostComp from "../../../components/SharePostComp";
import { ShareHeader } from "../../../components/ShareHeader";
import Head from "next/head";
import React from "react";
import { trpc } from "../../../utils/trpc";
import NavBar from "../../../components/NavBar";
import { iosDetect } from "../../../utils/checkIOS";
import { useRouter } from "next/router";

const Share = () => {
	const [selectedPosts, setSelectedPosts] = React.useState<Set<string>>(new Set());
	const [text, setText] = React.useState<string>("Share");
	const router = useRouter();
	const groupId = router.query.groupId as string;
	const { data } = trpc.posts.getGroupPosts.useQuery({ groupId });

	const { mutate } = trpc.posts.sharePosts.useMutation({
		onSuccess: async res => {
			setText("Loading...");
			if (iosDetect(window.navigator)) {
				// Get base url if on ios
				if (window !== undefined) {
					const baseUrl = window.location.origin;
					await navigator.share({
						title: "Group Pray",
						text: `Check out these posts on Group Pray!`,
						url: `${baseUrl}/invites/${res}`,
					});
				} else {
					// If window is undefined, then on ios safari and can't use window.location.origin
					await navigator.share({
						title: "Group Pray",
						text: `Check out these posts on Group Pray!`,
						url: `https://group-pray.vercel.app/share/${res}`,
					});
				}
			} else {
				const inviteLink = window.location.origin + "/share/" + res;
				const clipText = new ClipboardItem({
					"text/plain": new Blob([inviteLink], {
						type: "text/plain",
					}),
				});
				await navigator.clipboard.write([clipText]);
			}
			setText("Copied to clipboard!");
			setTimeout(() => {
				setText("Share");
			}, 4000);
		},
	});

	const onSelect = (id: string) => {
		if (selectedPosts.has(id)) {
			setSelectedPosts(prev => {
				const newSet = new Set(prev);
				newSet.delete(id);
				return newSet;
			});
		} else {
			setSelectedPosts(prev => new Set(prev).add(id));
		}
	};

	const onSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		mutate({
			postIds: Array.from(selectedPosts),
		});
	};

	return (
		<>
			<Head>
				<title>Group Pray - Share</title>
				<meta name="description" content="Pray with company" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<NavBar />
			<main>
				<div className="md:grid md:grid-cols-3 md:p-5 p-2 h-[85vh] ">
					<ShareHeader />
					<div className="col-start-2 p-2 justify-center backdrop-sepia-0 bg-white/70 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-md">
						<form onSubmit={onSubmit}>
							<div className="p-2 overflow-y-scroll h-full">
								{data?.pubPosts.map(post => (
									<SharePostComp post={post} key={post.id} onSelect={onSelect} />
								))}
								{data?.privatePosts.map(post => (
									<SharePostComp post={post} key={post.id} onSelect={onSelect} />
								))}
							</div>
							<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
								{text}
							</button>
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default Share;
