import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { createPostInput } from "../schema/post.schema";
import { trpc } from "../utils/trpc";

interface Props {
  userId: string;
}

const CreatePostForm: FC<Props> = ({ userId }) => {
  const [text, setText] = useState("Create Post");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createPostInput>();
  const router = useRouter();
  const { groupId } = router.query;

  if (!groupId) {
    router.back();
  }

  const { mutate } = trpc.useMutation(["posts.createPost"], {
    onSuccess: (res) => {
      router.push(`/posts/${res.postId}`);
    },
  });

  const onSubmit = (data: createPostInput) => {
    setText("Loading...");

    mutate({ ...data, groupId: groupId as string, userId });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center w-full"
    >
      <div className="flex flex-col w-[85%]">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title"
          className="border-2 border-gray-300 p-2 rounded-md"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">Title is required</p>
        )}
      </div>
      <div className="flex flex-col w-[85%]">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          placeholder="Enter your prayer request here"
          className="border-2 border-gray-300 p-2 rounded-md"
          {...register("content", { required: true })}
        />
        {errors.content && <p>Content is required</p>}
      </div>
      <div className="flex flex-col w-[85%] justify-center items-center">
        <label htmlFor="Annonymous">Make anonymous?</label>
        <input
          type="checkbox"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          placeholder="Make Annonymous?"
          {...register("annonymous", { required: false })}
        />
      </div>
      <input type="hidden" value={userId} {...register("userId")} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded"
        type="submit"
      >
        {text}
      </button>
    </form>
  );
};

export default CreatePostForm;
