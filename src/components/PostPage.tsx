import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { getImage } from "../utils/defaultUserImage";
import { trpc } from "../utils/trpc";
import LikesComp from "./LikesComp";

function PostPage() {
  const postId = useRouter().query.postId as string;
  const { data, isLoading } = trpc.posts.getPost.useQuery({ postId });

  return (
    <div className="card justify-center text-center bg-base-300 w-full p-5">
      <div className="card-title justify-center flex-col">
        <h1 className={`md:text-2xl font-bold text-center ${isLoading && "animate-pulse"}`}>
          {data?.title || "Loading..."}
        </h1>
        <h2 className="text-sm md:text-xl font-bold">Author</h2>
        <p className="text-base md:text-lg">{data?.authorName}</p>
        <Image
          src={getImage(data?.authorImage)}
          alt="User Image"
          width={40}
          height={40}
          className="md:h-24 md:w-24 avatar rounded-full self-center"
          priority
        />
      </div>
      <div className="card-body justify-center">
        <p className="md:text-xl text-sm text-center">{data?.content}</p>
        <p>{data && data?.createdAt.toDateString()} </p>
        <div className="card-actions justify-center">
          <div className="flex flex-row items-center justify-center hover:cursor-pointer">
            <LikesComp />
          </div>
          {!isLoading && (
            <Link href={`/groups/${data?.groupId}`} className="btn btn-primary">
              View Group
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
