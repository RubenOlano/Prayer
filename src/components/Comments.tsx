import React, { FC } from "react";
import { trpc } from "../utils/trpc";
import AddCommentButton from "./AddCommentButton";
import Comment from "./CommentComp";

interface Props {
	postId: string;
	userId: string;
}

const Comments: FC<Props> = ({ postId, userId }) => {
	const { data } = trpc.comments.fetchAllComments.useQuery({ postId });

	return (
		<div className="min-h-[80vh] align-middle backdrop-blur-2xl">
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 m-2 rounded-md md:max-w-[65vw]">
				<h1 className="text-2xl font-bold">Comments</h1>
				<AddCommentButton postId={postId} userId={userId} />
				{data?.map(comment => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	);
};

export default Comments;
