import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { createPostInput } from "../schema/post.schema";
import { trpc } from "../utils/trpc";

const CreatePostForm = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<createPostInput>();
	const groupId = router.query.groupId as string;
	if (!groupId) {
		return null;
	}
	const utils = trpc.useContext();
	const { mutate, isLoading } = trpc.posts.createPost.useMutation({
		onSuccess: async res => {
			await utils.posts.getAuthorPosts.invalidate();
			await utils.posts.getGroupPosts.invalidate({ groupId: groupId as string });
			router.push(`/posts/${res.postId}`);
		},
	});

	const onSubmit = (data: createPostInput) => {
		console.log(data);
		mutate({ ...data, groupId: groupId as string });
		reset();
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center w-full">
			<div className="flex flex-col w-[85%]">
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					placeholder="Title"
					className="border-2 border-gray-300 p-2 rounded-md"
					{...register("title", { required: true })}
				/>
				{errors.title && <p className="text-red-500 text-xs italic">Title is required</p>}
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
				<label htmlFor="Anonymous">Make anonymous?</label>
				<input
					type="checkbox"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					placeholder="Make Anonymous?"
					{...register("anonymous", { required: false })}
				/>
			</div>
			<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded" type="submit">
				{isLoading ? "Loading..." : "Submit"}
			</button>
		</form>
	);
};

export default CreatePostForm;
