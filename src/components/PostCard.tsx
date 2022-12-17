import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getImage } from "../utils/defaultUserImage";

interface Props {
  id: string;
  authorName: string | null;
  groupName: string;
  title: string;
  content: string;
  createdAt: Date;
  groupId: string;
  authorImage?: string | null;
}

function PostCard(post: Props) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="hover:cursor-pointer card card-normal shadow-xl bg-neutral text-neutral-content m-5"
    >
      <div className="card-body justify-center self-center text-2xl">
        <Image
          src={getImage(post.authorImage)}
          alt="name"
          height={25}
          width={25}
          className="avatar avatar-sm rounded-full justify-center self-center"
        />
        <h1>{post.authorName ?? "Member"}</h1>
        <h1>{post.groupName}</h1>
      </div>
      <div className="border-accent border-y-2 card-body">
        <h1 className="card-title text-center justify-center">{post.title}</h1>
        <p className="m-2 line-clamp-2">{post.content}</p>
      </div>
    </Link>
  );
}

export default PostCard;

PostCard.Skeleton = function PostCardSkeleton() {
  return (
    <div className="card card-normal shadow-xl bg-neutral text-neutral-content m-5 animate-pulse">
      <div className="card-body justify-center self-center text-2xl">
        <div className="avatar avatar-sm rounded-full justify-center self-center" />
        <h1 />
        <h1 />
      </div>
      <div className="border-accent border-y-2 card-body">
        <h1 className="card-title text-center justify-center" />
        <p className="m-2" />
      </div>
    </div>
  );
};
