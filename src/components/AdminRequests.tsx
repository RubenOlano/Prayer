import { Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { FC } from "react";
import PostDeleteButton from "./PostDeleteButton";

interface Props {
  regPosts?: (Post & {
    author: User;
  })[];
  anon?: {
    title: string;
    content: string | null;
    Duration: Date;
    id: string;
  }[];
}

const AdminRequests: FC<Props> = ({ regPosts, anon }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col py-2 h-[30rem] overflow-scroll">
        {regPosts &&
          regPosts.length > 0 &&
          regPosts?.map((post) => (
            <div
              className="flex flex-row justify-center items-center rounded-sm m-2 p-auto "
              key={post.id}
            >
              <PostDeleteButton postId={post.id} />
              <div
                className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25 w-full"
                key={post.id}
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <h2 className="text-2xl font-bold text-center m-3">
                  {post.title}
                </h2>
                <p className="italic font-bold text-center ">{`${post.author.fname} ${post.author.lname}`}</p>
              </div>
            </div>
          ))}
        {anon &&
          anon.length > 0 &&
          anon?.map((post) => (
            <div
              className="flex flex-row justify-center items-center rounded-sm m-2 p-auto "
              key={post.id}
            >
              <PostDeleteButton postId={post.id} />
              <div
                className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25 w-full"
                key={post.id}
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                <h2 className="text-2xl font-bold text-center m-3">
                  {post.title}
                </h2>
                <p className="italic font-bold text-center ">Anonymous</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AdminRequests;