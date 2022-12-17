import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { createGroupInput, createGroupSchema } from "../schema/group.schema";
import { trpc } from "../utils/trpc";

const CreateGroupForm = () => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createGroupInput>({
    resolver: zodResolver(createGroupSchema),
    criteriaMode: "all",
  });
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

  const { user } = session;

  const { mutate, isLoading, isSuccess } = trpc.groups.registerGroup.useMutation({
    onSuccess: data => router.push(`/groups/${data.id}`),
  });

  const onSubmit = (data: createGroupInput) => {
    if (!user) return signIn(undefined, { callbackUrl: "/groups/create" });
    mutate(data);
  };

  return (
    <form id="createGroup" onSubmit={handleSubmit(onSubmit)} className="form-control">
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
      {errors.name && <span className="text-error">{errors.name.message}</span>}
      <label className="label">
        <span className="label-text">Group Description</span>
        <input
          type="textarea"
          placeholder="Description"
          className={`input md:input-md input-sm ${errors.description && "input-error"}`}
          disabled={isLoading}
          {...register("description")}
        />
      </label>
      {errors.description && <span className="text-error">{errors.description.message}</span>}
      <label className="label">
        <span className="label-text">Private Group?</span>
        <span className="label-text">(will not show up in explore)</span>
        <input type="checkbox" className="checkbox checkbox-primary" disabled={isLoading} {...register("isPrivate")} />
      </label>
      {errors.isPrivate && <span className="text-error">{errors.isPrivate.message}</span>}
      <button
        className={`btn btn-primary btn-sm md:btn-md ${(isLoading && "disabled") || ""}`}
        type="submit"
        form="createGroup"
      >
        {isLoading ? "Loading..." : isSuccess ? "Created Group!" : "Create Group"}
      </button>
    </form>
  );
};

export default CreateGroupForm;
