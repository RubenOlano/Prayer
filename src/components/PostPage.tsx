import { Group, GroupMember, Post } from "@prisma/client";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  post: Post & {
    Group:
      | (Group & {
          GroupMembers: GroupMember[];
        })
      | null;
  };
}

const PostPage: FC<Props> = ({ post }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-max py-2 m-auto absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-6xl font-bold">{post.title}</h1>
      <p className="text-2xl">{post.content}</p>
      <p className="text-2xl">
        {post.createdAt.toLocaleString()} - {post.Group?.GroupMembers.length}{" "}
        {post.Group?.GroupMembers.length === 1 ? "member" : "members"}
      </p>
      <h2
        className="text-3xl font-bold hover:cursor-pointer"
        onClick={() => router.push(`/groups/${post.groupId}`)}
      >
        Posted in {post.Group?.name} - {post.Group?.description}
      </h2>
    </div>
  );
};

export default PostPage;
