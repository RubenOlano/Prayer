import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { createPostInput, createPostSchema } from "../schema/post.schema";
import { trpc } from "../utils/trpc";

const CreatePostForm = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<createPostInput>({
		resolver: zodResolver(createPostSchema),
	});

	const groupId = router.query.groupId as string;

	const utils = trpc.useContext();
	const { mutate, isLoading, isSuccess } = trpc.posts.createPost.useMutation({
		onSuccess: async res => {
			await utils.posts.getGroupPosts.invalidate({ groupId });
			router.push(`/posts/${res.post.id}`);
		},
	});

	const onSubmit = (data: createPostInput) => {
		mutate({ ...data, groupId: groupId as string });
		reset();
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="form-control">
			<label className="label">
				<span className="label-text">Title</span>
				<input
					type="text"
					id="title"
					placeholder="Title"
					className={`input input-sm md:input-md ${errors.title && "input-error"}`}
					disabled={isLoading}
					{...register("title", { required: true })}
				/>
			</label>
			{errors.title && <span className="text-error">{errors.title.message}</span>}
			<label className="label">
				<span className="label-text">Body</span>
				<textarea
					id="content"
					placeholder="Enter your prayer request here"
					className={`textarea ${errors.content && "textarea-error"}`}
					disabled={isLoading}
					{...register("content", { required: true })}
				/>
			</label>
			{errors.content && <span className="text-error">{errors.content.message}</span>}
			<label className="label">
				<span className="label-text">Anonymous?</span>
				<input
					type="checkbox"
					className="checkbox checkbox-primary flex justify-center"
					disabled={isLoading}
					{...register("anonymous", { required: false })}
				/>
			</label>
			<button
				className={`btn btn-primary mt-2 ${isLoading ? "loading" : isSuccess && "btn-success disabled"}`}
				type="submit"
			>
				{isLoading ? "Loading..." : isSuccess ? "Success!" : "Submit"}
			</button>
		</form>
	);
};

export default CreatePostForm;
