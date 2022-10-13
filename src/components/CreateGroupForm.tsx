import { User } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { createGroupInput } from "../schema/group.schema";
import { trpc } from "../utils/trpc";

interface Props {
	user: User;
}

const CreateGroupForm: FC<Props> = ({ user }) => {
	const utils = trpc.useContext();
	const [text, setText] = useState("Create Group");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<createGroupInput>();

	const router = useRouter();
	const { mutate } = trpc.useMutation(["groups.registerGroup"], {
		onSuccess: async (data) => {
			await utils.invalidateQueries("groups.getGroups");
			router.push(`/groups/${data.groupId}`);
		},
	});

	const onSubmit = (data: createGroupInput) => {
		setText("Loading...");
		if (!user) return signIn(undefined, { callbackUrl: "/groups/create" });
		mutate({
			...data,
			userId: user.id,
		});
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col justify-center items-center w-full m-2"
		>
			<input
				type="text"
				placeholder="Group Name"
				className="border-2 border-gray-300 p-2 rounded-md flex"
				{...register("name", { required: true })}
			/>
			{errors.name && <span>This field is required</span>}
			<input
				type="area"
				placeholder="Group Description"
				className="border-2 border-gray-300 p-2 rounded-md flex"
				{...register("description")}
			/>
			{errors.description && <span>This field is required</span>}
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded flex justify-center items-center"
				type="submit"
			>
				{text}
			</button>
		</form>
	);
};

export default CreateGroupForm;
