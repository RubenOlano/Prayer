import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { createGroupInput } from "../schema/group.schema";
import { trpc } from "../utils/trpc";

const CreateGroupForm = () => {
	const { data: session } = useSession();
	const utils = trpc.useContext();

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

	const { mutate, isLoading, isSuccess } = trpc.groups.registerGroup.useMutation({
		onSuccess: async data => {
			await utils.groups.getGroups.invalidate();
			await utils.groups.getGroups.prefetch();
			await utils.groups.getGroup.prefetch({ id: data.id });
			router.push(`/groups/${data.id}`);
		},
	});

	const onSubmit = (data: createGroupInput) => {
		if (!user) return signIn(undefined, { callbackUrl: "/groups/create" });
		mutate({
			...data,
			userId: user.id,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="form-control">
			<label className="label">
				<span className="label-text">Group Name</span>
				<input
					type="text"
					placeholder="Name"
					className={`input input-sm md:input-md ${errors.name && "input-error"}`}
					disabled={isLoading}
					{...register("name", { required: true })}
				/>
			</label>
			{errors.name && <span className="text-error">This field is required</span>}
			<label className="label">
				<span className="label-text">Group Description</span>
				<input
					type="area"
					placeholder="Description"
					className={`input md:input-md input-sm ${errors.description && "input-error"}`}
					disabled={isLoading}
					{...register("description")}
				/>
			</label>
			{errors.description && <span className="text-error">This field is required</span>}
			<label className="label">
				<span className="label-text">Private Group?</span>
				<span className="label-text">(will not show up in explore)</span>
				<input
					type="checkbox"
					className="checkbox checkbox-primary"
					disabled={isLoading}
					{...register("isPrivate")}
				/>
			</label>
			<button
				className={`btn btn-primary btn-sm md:btn-md ${isLoading && "disabled"}`}
				type="submit"
				disabled={isLoading}
			>
				{isLoading ? "Loading..." : isSuccess ? "Created Group!" : "Create Group"}
			</button>
		</form>
	);
};

export default CreateGroupForm;
