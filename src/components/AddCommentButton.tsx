import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateCommentSchema } from "../schema/comments.schema";
import { trpc } from "../utils/trpc";

interface Props {
	postId: string;
}

const AddCommentButton: FC<Props> = ({ postId }) => {
	const utils = trpc.useContext();
	const [clicked, setClicked] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateCommentSchema>();
	const { mutate, isLoading } = trpc.comments.createComments.useMutation({
		onSuccess: async () => {
			await utils.comments.fetchAllComments.invalidate({ postId });
			await utils.comments.fetchAllComments.refetch({ postId });
			setClicked(false);
			reset();
		},
	});

	const onSubmit = (data: CreateCommentSchema) => {
		mutate({
			...data,
			postId,
		});
	};

	if (clicked) {
		return (
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 m-2 rounded-lg md:max-w-[65vw]">
				<h1 className="md:text-2xl text-base font-bold">Add Comment</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center">
					<textarea
						placeholder="Comment"
						className="border-2 border-black rounded-md p-2 m-2"
						{...register("content")}
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
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
			<button
				className={`bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 px-4 rounded-lg ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
				onClick={() => setClicked(true)}
			>
				Add Comment
			</button>
		);
	}
};

export default AddCommentButton;
