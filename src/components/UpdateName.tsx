import { useForm } from "react-hook-form";
import { updateUserNameInput } from "../schema/user.schema";
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
	} = useForm<updateUserNameInput>();
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
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-center px-5">
			<label htmlFor="name" className="text-gray-500">
				Update Name
			</label>
			<input type="text" {...register("name")} className="input input-primary" />
			<button
				className={`bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded ${
					isLoading && "cursor-not-allowed"
				} ${isSuccess && "bg-success"}`}
				type="submit"
				placeholder="New Name..."
				disabled={isLoading}
			>
				{isSuccess ? "Name Updated!" : "Update Name"}
			</button>
			<div className="text-red-500">{errors.name?.message}</div>
		</form>
	);
}

export default UpdateName;

UpdateName.Skeleton = function UpdateNameSkeleton() {
	return (
		<form className="flex flex-col text-center px-5">
			<label htmlFor="name" className="text-gray-500">
				Update Name
			</label>
			<input type="text" className="input input-primary" />
			<button className={`bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded `}>
				Update Name
			</button>
		</form>
	);
};
