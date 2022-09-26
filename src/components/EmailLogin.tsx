import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { emailLoginUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

const EmailLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<emailLoginUserInput>();
  const router = useRouter();

  const { mutate, error } = trpc.useMutation(["users.emailLoginUser"], {
    onSuccess: () => {
      router.replace("/");
      console.log("success");
    },
  });

  const onSubmit = async (vals: emailLoginUserInput) => {
    mutate(vals);
  };

  return (
    <div className="text-center rounded-sm p-2 box-border justify-center w-full flex flex-col">
      <h1 className="text-2xl font-bold">Login with email</h1>
      {error && <p className="text-red-500">{error.message}</p>}
      <div className="items-center flex justify-center p-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Email"
            className={`p-4 inline-block w-full border-2 ${
              errors.email ? "border-red-500" : "border-transparent"
            }`}
            {...register("email", { required: "Email Required" })}
          />
          {errors?.email && (
            <span className="text-red-500">
              {errors.email.message}
              <br />
            </span>
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            className={`p-4 inline-block w-full border-2 ${
              errors.password ? "border-red-500" : "border-transparent"
            }`}
            {...register("password", { required: "Password Required" })}
          />
          {errors?.password && (
            <span className="text-red-500">
              {errors.password.message}
              <br />
            </span>
          )}
          <button
            type="submit"
            className="p-4 w-full bg-blue-500 text-white rounded-md mt-12"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailLogin;
