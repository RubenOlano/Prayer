import React from "react";
import { trpc } from "../utils/trpc";
import AddCommentButton from "./AddCommentButton";
import Comment from "./CommentComp";

interface Props {
  postId: string;
}

function Comments({ postId }: Props) {
  const { data, isLoading } = trpc.comments.fetchAllComments.useQuery({ postId });

  if (!data && !isLoading) {
  }

  return (
    <div className="flex flex-col justify-center text-center p-5">
      <h1 className="md:text-2xl text-base font-bold">Comments</h1>
      {isLoading ? <AddCommentButton.Skeleton /> : <AddCommentButton postId={postId} />}
      <div className="overflow-y-scroll md:h-[60vh] m-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Comment.Skeleton key={i} />)
          : data?.map(comment => <Comment key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
}

export default Comments;
