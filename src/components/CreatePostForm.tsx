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
			await utils.posts.getGroupPosts.prefetch({ groupId: groupId as string });
			router.push(`/posts/${res.postId}`);
		},
	});

	const onSubmit = (data: createPostInput) => {
		console.log(data);
		mutate({ ...data, groupId: groupId as string });
		reset();
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="form-control flex flex-col">
			<label className="label" htmlFor="title">
				Title
			</label>
			<input
				type="text"
				id="title"
				placeholder="Title"
				className="input input-bordered w-full"
				disabled={isLoading}
				{...register("title", { required: true })}
			/>
			{errors.title && <p className="text-red-500 text-xs italic">Title is required</p>}
			<label htmlFor="content">Content</label>
			<textarea
				id="content"
				placeholder="Enter your prayer request here"
				className="textarea textarea-bordered"
				disabled={isLoading}
				{...register("content", { required: true })}
			/>
			{errors.content && <p>Content is required</p>}
			<div>
				<label htmlFor="Anonymous">Make anonymous?</label>
				<input
					type="checkbox"
					className="checkbox checkbox-primary flex justify-center"
					placeholder="Make Anonymous?"
					disabled={isLoading}
					{...register("anonymous", { required: false })}
				/>
				<button className={`btn btn-primary mt-2 ${isLoading ? "loading" : ""}`} type="submit">
					Submit
				</button>
			</div>
		</form>
	);
};

export default CreatePostForm;
