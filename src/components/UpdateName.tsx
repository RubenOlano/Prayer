import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserNameInput, updateUserNameSchema } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

interface Props {
	userId: string;
}

function UpdateName({ userId }: Props) {
	const utils = trpc.useContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<updateUserNameInput>({ resolver: zodResolver(updateUserNameSchema) });
	const { mutate, isLoading, isSuccess } = trpc.users.updateUserName.useMutation({
		onSuccess: async () => {
			await utils.users.getUser.refetch({ id: userId });
		},
	});
	const onSubmit = (data: updateUserNameInput) => {
		mutate({ ...data, id: userId });
		reset();
	};
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-center px-5">
				<label className="label flex-col">
					<span className="label-text">Update Name</span>
					<input
						type="text"
						{...register("name")}
						className={`input input-primary ${errors.name && "input-error"}`}
						disabled={isLoading}
					/>
				</label>

				<button
					className={`bg-primary hover:bg-primary-focus text-primary-content font-bold py-2 px-4 rounded ${
						isLoading && "disabled"
					} ${isSuccess && "bg-success"}`}
					type="submit"
					placeholder="New Name..."
					disabled={isLoading}
				>
					{isSuccess ? "Name Updated!" : "Update Name"}
				</button>
			</form>
			<div className="text-red-500">{errors.name?.message}</div>
		</>
	);
}

export default UpdateName;
