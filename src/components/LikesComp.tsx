import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../utils/trpc";
import Liked from "/public/FilledMoji.svg";
import NotLiked from "/public/OutlinedMoji.svg";

const LikesComp = () => {
  const postId = useRouter().query.postId as string;
  const utils = trpc.useContext();

  const { data: liked, isLoading } = trpc.posts.getUserLiked.useQuery({ postId });
  const { data: numLikes } = trpc.posts.getNumberOfLikes.useQuery({ postId });
  const { mutate } = trpc.posts.toggleLikePost.useMutation({
    onSuccess: async () => {
      await utils.posts.getUserLiked.refetch({ postId });
      await utils.posts.getNumberOfLikes.refetch({ postId });
    },
  });

  return (
    <div className="btn btn-primary btn-outline" onClick={() => mutate({ postId })}>
      {isLoading ? (
        <Image src={NotLiked} alt="Not Liked" width={20} height={20} className="loading" />
      ) : liked ? (
        <Image src={Liked} alt="Liked" width={20} height={20} className="liked" />
      ) : (
        <Image src={NotLiked} alt="Not Liked" width={20} height={20} className="not-liked" />
      )}
      {!isLoading && <p className="ml-2">{numLikes || 0}</p>}
    </div>
  );
};

export default LikesComp;
