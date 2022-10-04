import { FC } from "react";
import { useQueryClient } from "react-query";
import { debounce } from "../utils/debounce";
import { trpc } from "../utils/trpc";

interface Props {
  postId: string;
}



const PostDeleteButton: FC<Props> = ({ postId }) => {
  const queryClient = useQueryClient();
  const { mutate } = trpc.useMutation("posts.deletePost", {
    onMutate() {
      debounce(() => {
        queryClient.cancelQueries("posts.getGroupPosts");
        queryClient.cancelQueries("posts.getAnonPosts");
        queryClient.refetchQueries("posts.getGroupPosts");
        queryClient.refetchQueries("posts.getAnonPosts");
      }, 100)();
    },
  });

  const deletePost = async () => {
    await mutate({ postId });
  };
  return (
    <button
      onClick={deletePost}
      className=" bg-red-500 hover:bg-red-700 px-3 py-2 rounded-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default PostDeleteButton;
