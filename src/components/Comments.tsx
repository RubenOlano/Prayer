import React from "react";
import { trpc } from "../utils/trpc";
import AddCommentButton from "./AddCommentButton";
import Comment from "./CommentComp";

interface Props {
	postId: string;
}

function Comments({ postId }: Props) {
	const { data, isLoading } = trpc.comments.fetchAllComments.useQuery({ postId });

	if (isLoading) {
		return (
			<div className="md:min-w-[40%] bg-base-200">
				<div className="flex flex-col items-center justify-center py-2 p-3 m-2 rounded-md md:max-w-[65vw]">
					<h1 className="md:text-2xl text-base font-bold">Comments</h1>
					<AddCommentButton postId={postId} />
					{Array.from({ length: 5 }).map((_, i) => (
						<Comment.Skeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="md:min-w-[40%] bg-base-200">
			<div className="flex flex-col items-center justify-center py-2 p-3 m-2 rounded-md md:max-w-[65vw]">
				<h1 className="md:text-2xl text-base font-bold">Comments</h1>
				<AddCommentButton postId={postId} />
				{data?.map(comment => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	);
}

export default Comments;

Comments.Skeleton = function CommentsSkeleton() {
	return (
		<div className="md:min-w-[40%] bg-base-200 animate-pulse">
			<div className="flex flex-col items-center justify-center py-2 p-3 m-2 rounded-md md:max-w-[65vw]">
				<h1 className="md:text-2xl text-base font-bold">Comments</h1>
				{Array.from({ length: 5 }).map((_, i) => (
					<Comment.Skeleton key={i} />
				))}
			</div>
		</div>
	);
};
