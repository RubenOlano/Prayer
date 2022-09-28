import { User } from "next-auth";
import { useRouter } from "next/router";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { createGroupInput } from "../schema/group.schema";
import { trpc } from "../utils/trpc";

interface Props {
  user: User;
}

const CreateGroupForm: FC<Props> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createGroupInput>();

  const router = useRouter();
  const { mutate } = trpc.useMutation(["groups.registerGroup"], {
    onSuccess: (data) => {
      router.replace(`/groups/${data.groupId}`);
    },
  });

  const onSubmit = (data: createGroupInput) => {
    if (!user) return router.replace("/auth/signin");
    mutate({
      ...data,
      userId: user.id,
    });
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Group Name"
          className="border-2 border-gray-300 p-2 rounded-md"
          {...register("name", { required: true })}
        />
        {errors.name && <span>This field is required</span>}
        <input
          type="text"
          placeholder="Group Description"
          className="border-2 border-gray-300 p-2 rounded-md"
          {...register("description")}
        />
        {errors.description && <span>This field is required</span>}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
