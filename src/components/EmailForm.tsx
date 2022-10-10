import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

const EmailForm = () => {
	const router = useRouter();
	const callbackUrl = router.query.callbackUrl as string;
	const [text, setText] = useState("Sign Up");

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<createUserInput>();
	const password = useRef({});
	password.current = watch("password");
	const { mutate, error } = trpc.useMutation(["users.registerUser"]);

	const onSubmit = async (vals: createUserInput) => {
		setText("Loading...");
		await mutate(vals, {
			onSuccess: async () => {
				await signIn("credentials", {
					email: vals.email,
					password: vals.password,
					callbackUrl,
				});
			},
		});
	};

	return (
		<div className="text-center rounded-sm p-2 box-border justify-center flex flex-col backdrop-sepia-10 bg-white/70">
			{error && (
				<p className="text-red-500">
					<strong>{error.message}</strong>
				</p>
			)}
			<h1 className="text-2xl font-bold">Sign Up with email</h1>
			<div className="items-center flex justify-center p-5">
				<form onSubmit={handleSubmit(onSubmit)}>
					<label htmlFor="fname">First Name</label>
					<input
						type="text"
						placeholder="First Name"
						className={`p-4 inline-block w-full border-2 ${
							errors.fname
								? "border-red-500"
								: "border-transparent"
						}`}
						{...register("fname", {
							required: "First Name Required",
						})}
					/>
					{errors?.fname && (
						<span className="text-red-500">
							{errors.fname.message}
							<br />
						</span>
					)}

					<label htmlFor="lname">Last Name</label>
					<input
						type="text"
						placeholder="Last Name"
						className={`p-4 inline-block w-full border-2 ${
							errors.lname
								? "border-red-500"
								: "border-transparent"
						}`}
						{...register("lname", {
							required: "Last Name Required",
						})}
					/>
					{errors?.lname && (
						<span className="text-red-500">
							{errors.lname.message}
							<br />
						</span>
					)}
					<label htmlFor="email">Email</label>
					<input
						type="text"
						placeholder="Email"
						className={`p-4 inline-block w-full border-2 ${
							errors.email
								? "border-red-500"
								: "border-transparent"
						}`}
						{...register("email", {
							validate: (value) =>
								z.string().email().safeParse(value).success ||
								"Invalid email address",
							required: "Email Required",
						})}
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
							errors.password
								? "border-red-500"
								: "border-transparent"
						}`}
						{...register("password", {
							required: "Password Required",
							validate: (value) =>
								z.string().min(8).safeParse(value).success ||
								"Password must be at least 8 characters",
						})}
					/>
					{errors?.password && (
						<span className="text-red-500">
							{errors.password.message}
							<br />
						</span>
					)}
					<label htmlFor="password">Confirm Password</label>
					<input
						type="password"
						placeholder="Confirm Password"
						className={`p-4 inline-block w-full border-2 ${
							errors.password
								? "border-red-500"
								: "border-transparent"
						}`}
						{...register("confirmPassword", {
							required: "Please Confirm Password",
							validate: (val) =>
								val === password.current ||
								"Passwords do not match",
						})}
					/>
					{errors?.confirmPassword && (
						<span className="text-red-500">
							{errors.confirmPassword.message}
							<br />
						</span>
					)}
					<div className="p-12">
						<button className=" flex items-center justify-center w-full h-12 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-blue-400 hover:text-white">
							{text}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EmailForm;
