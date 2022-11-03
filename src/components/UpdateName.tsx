import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { updateUserNameInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

interface Props {
	userId: string;
}

const UpdateName: FC<Props> = ({ userId }) => {
	const utils = trpc.useContext();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<updateUserNameInput>();
	const { mutate } = trpc.users.updateUserName.useMutation({
		onSuccess: () => {
			utils.users.getUser.invalidate({ id: userId });
		},
	});
	const onSubmit = (data: updateUserNameInput) => {
		mutate({ ...data, id: userId });
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-center px-5 ">
			<label htmlFor="name" className="text-gray-500">
				Update Name
			</label>
			<input
				type="text"
				{...register("name")}
				className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
			/>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
				type="submit"
				placeholder="New Name..."
			>
				Update Name
			</button>
			<div className="text-red-500">{errors.name?.message}</div>
		</form>
	);
};

export default UpdateName;
