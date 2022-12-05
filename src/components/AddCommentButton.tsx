import { useState } from "react";
import { useForm } from "react-hook-form";
import { createCommentSchema, CreateCommentSchema } from "../schema/comments.schema";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
	postId: string;
}

function AddCommentButton({ postId }: Props) {
	const utils = trpc.useContext();
	const [clicked, setClicked] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateCommentSchema>({ resolver: zodResolver(createCommentSchema), criteriaMode: "all" });
	const { mutate, isLoading } = trpc.comments.createComment.useMutation({
		onSuccess: async () => {
			reset();
			await utils.comments.fetchAllComments.refetch({ postId });
		},
	});

	const onSubmit = (data: CreateCommentSchema) => {
		setClicked(false);

		mutate({
			...data,
			postId,
		});
	};

	if (clicked) {
		return (
			<div className="flex flex-col items-center justify-center py-2 p-3 m-2 rounded-lg md:max-w-[65vw]">
				<h1 className="md:text-2xl text-base font-bold">Add Comment</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center">
					<textarea
						placeholder="Comment"
						className="border-2 border-black rounded-md p-2 m-2"
						{...register("content")}
					/>
					<button type="submit" className={`btn btn-primary ${isLoading && "animate-pulse "} `}>
						Submit
					</button>
					<div className="flex flex-col items-center justify-center">
						{errors.content && (
							<p className="text-red-500">{errors.content.message || "Something went wrong"}</p>
						)}
					</div>
				</form>
			</div>
		);
	} else {
		return (
			<button className={`btn btn-primary ${isLoading && "animate-pulse"}`} onClick={() => setClicked(true)}>
				Add Comment
			</button>
		);
	}
}

export default AddCommentButton;

AddCommentButton.Skeleton = function AddCommentButtonSkeleton() {
	return <button className={`btn btn-primary`}>Add Comment</button>;
};
