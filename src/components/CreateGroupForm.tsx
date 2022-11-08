import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createGroupInput } from "../schema/group.schema";
import { trpc } from "../utils/trpc";

const CreateGroupForm = () => {
	const { data: session } = useSession();
	const utils = trpc.useContext();
	const [text, setText] = useState("Create Group");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<createGroupInput>();
	const router = useRouter();

	if (!session || !session.user) {
		return (
			<div className="flex flex-col justify-center items-center">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => signIn()}
				>
					Sign in to create a group
				</button>
			</div>
		);
	}

	const user = session.user;

	const { mutate, isLoading } = trpc.groups.registerGroup.useMutation({
		onSuccess: async data => {
			await utils.groups.getGroups.invalidate();
			await utils.groups.getGroups.prefetch();
			await utils.groups.getGroup.prefetch({ id: data.id });
			router.push(`/groups/${data.id}`);
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
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center w-full m-2">
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
				className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded flex justify-center items-center ${
					isLoading ? "opacity-50 cursor-not-allowed" : ""
				}`}
				type="submit"
			>
				{text}
			</button>
		</form>
	);
};

export default CreateGroupForm;
