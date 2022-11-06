import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import AddCommentButton from "./AddCommentButton";
import Comment from "./CommentComp";

interface Props {
	postId: string;
}

const Comments: FC<Props> = ({ postId }) => {
	const { data } = trpc.comments.fetchAllComments.useQuery({ postId });

	return (
		<div className="min-w-[40%]">
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 m-2 rounded-md md:max-w-[65vw]">
				<h1 className="text-2xl font-bold">Comments</h1>
				<AddCommentButton postId={postId} />
				{data?.map(comment => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	);
};

export default Comments;
