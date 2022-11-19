import SharePostComp from "../../../components/SharePostComp";
import { ShareHeader } from "../../../components/ShareHeader";
import Head from "next/head";
import React from "react";
import { trpc } from "../../../utils/trpc";
import { iosDetect } from "../../../utils/checkIOS";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";

interface Props {
	groupId: string;
}

const Share: NextPage<Props> = ({ groupId }) => {
	const [selectedPosts, setSelectedPosts] = React.useState<Set<string>>(new Set());
	const { data, isLoading: postsLoading } = trpc.posts.getGroupPosts.useInfiniteQuery({ groupId });

	const { mutate, isLoading, isSuccess } = trpc.posts.sharePosts.useMutation({
		onSuccess: async res => {
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
		},
	});

	if (postsLoading) {
		return (
			<>
				<Head>
					<title>Group Pray - Share</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="md:pl-40 md:grid md:grid-cols-3 md:p-5 p-2 h-[85vh] ">
						<ShareHeader />
						<div className="col-start-2 p-2 justify-center rounded-md">
							<form className="form-control">
								{Array.from({ length: 5 }).map((_, i) => (
									<SharePostComp.Skeleton key={i} />
								))}
								<button className="btn btn-primary font-bold py-2 px-4 rounded w-full ">
									{isLoading ? "Loading..." : isSuccess ? "Copied!" : "Share"}
								</button>
							</form>
						</div>
					</div>
				</main>
			</>
		);
	}

	if (!data) {
		return (
			<>
				<Head>
					<title>Group Pray - Share</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="md:pl-40 md:grid md:grid-cols-3 md:p-5 p-2 h-[85vh] ">
						<ShareHeader />
						<div className="col-start-2 p-2 justify-center rounded-md">No posts to share</div>
					</div>
				</main>
			</>
		);
	}

	if (!data.pages) {
		console.log(data);

		return (
			<>
				<Head>
					<title>Group Pray - Share</title>
					<meta name="description" content="Pray with company" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<main>
					<div className="md:pl-40 md:grid md:grid-cols-3 md:p-5 p-2 h-[85vh] ">
						<ShareHeader />
						<div className="col-start-2 p-2 justify-center">No posts to share</div>
					</div>
				</main>
			</>
		);
	}

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
			<main>
				<div className="md:pl-40 md:grid md:grid-cols-3 md:p-5 p-2 h-[85vh] ">
					<ShareHeader />
					<div className="col-start-2 p-2 justify-center ">
						<form onSubmit={onSubmit}>
							<div className="p-2 overflow-y-scroll h-full">
								{data.pages.map(page =>
									page.posts.map(post => (
										<SharePostComp key={post.id} {...post} onSelect={onSelect} />
									))
								)}
							</div>
							<button className="bnt btn-primary font-bold py-2 px-4 rounded w-full">
								{isLoading ? "Loading..." : isSuccess ? "Copied!" : "Share"}
							</button>
						</form>
					</div>
				</div>
			</main>
		</>
	);
};

export default Share;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const groupId = ctx.query.groupId as string;
	const session = await unstable_getServerSession(ctx.req, ctx.res, options);

	if (!session) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			groupId,
			session,
		},
	};
};
