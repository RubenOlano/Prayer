import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateCommentSchema } from "../schema/comments.schema";
import { trpc } from "../utils/trpc";

interface Props {
	postId: string;
	userId: string;
}

const AddCommentButton: FC<Props> = ({ postId, userId }) => {
	const utils = trpc.useContext();
	const [clicked, setClicked] = useState(false);
	const { register, handleSubmit } = useForm<CreateCommentSchema>();
	const { mutate } = trpc.useMutation("comments.createComment", {
		onSuccess: async () => {
			await utils.invalidateQueries("comments.fetchAllComments");
			setClicked(false);
		},
	});

	const onSubmit = (data: CreateCommentSchema) => {
		mutate({
			...data,
			postId,
			userId,
		});
	};

	if (clicked) {
		return (
			<div className="flex flex-col items-center justify-center py-2 backdrop-sepia-0 bg-white/60 p-3 m-2 rounded-md md:max-w-[65vw]">
				<h1 className="text-2xl font-bold">Add Comment</h1>
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
				</form>
			</div>
		);
	} else {
		return (
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => setClicked(true)}
			>
				Add Comment
			</button>
		);
	}
};

export default AddCommentButton;
