import SharePostComp from "./../../../components/SharePostComp";
import { ShareHeader } from "../../../components/ShareHeader";
import Head from "next/head";
import React from "react";
import { trpc } from "../../../utils/trpc";
import NavBar from "../../../components/NavBar";
import { useRouter } from "next/router";
import { Post } from "@prisma/client";
import { iosDetect } from "../../../utils/checkIOS";

const Share = () => {
	const [selectedPosts, setSelectedPosts] = React.useState<Set<string>>(new Set());
	const [text, setText] = React.useState<string>("Share");
	const router = useRouter();
	const groupId = router.query.groupId as string;
	const { data } = trpc.useQuery(["posts.getGroupPosts", { groupId }]);
	const { data: anonPosts } = trpc.useQuery(["posts.getAnonPosts", { groupId }]);
	const { mutate } = trpc.useMutation("posts.sharePosts", {
		onSuccess: async res => {
			router.push(`/share/${res}`);
			if (iosDetect(window.navigator)) {
				await window.navigator.share({
					title: "Group Pray",
					text: "Check out my prayers!",
					url: `https://group-pray.vercel.app/share/${res}`,
				});
			} else {
				await window.navigator.clipboard.writeText(`https://group-pray.vercel.app/share/${res}`);
				setText("Copied to clipboard!");
				setTimeout(() => {
					setText("Share");
				}, 2000);
			}
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
								{data?.map(post => (
									<SharePostComp post={post} key={post.id} onSelect={onSelect} />
								))}
								{anonPosts?.map(post => (
									<SharePostComp post={post as Post} key={post.id} onSelect={onSelect} />
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
