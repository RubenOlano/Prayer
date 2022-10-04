import { FC } from "react";
import { useForm } from "react-hook-form";
import { updateUserPasswordInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

interface Props {
	userId: string;
}

const UpdatePassword: FC<Props> = ({ userId }) => {
	const { register, handleSubmit } = useForm<updateUserPasswordInput>();
	const { mutate } = trpc.useMutation("users.updateUserPassword");

	const onSubmit = (vals: updateUserPasswordInput) => {
		mutate({ ...vals, id: userId });
	};
	return (
		<div className="flex flex-col justify-center items-center">
			<h3 className="text-xl">Change Password</h3>
			<form
				className="flex flex-col justify-center items-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<input
					type="password"
					placeholder="Current Password"
					className="p-4 inline-block w-full border-2 border-transparent m-2"
					{...register("curr_password")}
				/>
				<input
					type="password"
					placeholder="New Password"
					className="p-4 inline-block w-full border-2 border-transparent m-2"
					{...register("new_password")}
				/>
				<input
					type="password"
					placeholder="Confirm New Password"
					className="p-4 inline-block w-full border-2 border-transparent m-2"
					{...register("confirm_password")}
				/>
				<button
					type="submit"
					className="p-4 inline-block w-full border-2 border-transparent bg-blue-500 text-white rounded-md hover:bg-blue-600"
				>
					Change Password
				</button>
			</form>
		</div>
	);
};

export default UpdatePassword;
