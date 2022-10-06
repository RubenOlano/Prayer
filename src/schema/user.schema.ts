import z from "zod";

export const createUserSchema = z
	.object({
		fname: z.string(),
		lname: z.string(),
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine(async (data) => data.confirmPassword === data.password, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const createUserOutputSchema = z.object({
	fname: z.string(),
	lname: z.string(),
	email: z.string().email(),
	password: z.string().min(8),
});

export type createUserInput = z.TypeOf<typeof createUserSchema>;
export type createUserOutput = z.TypeOf<typeof createUserOutputSchema>;

export const emailLoginUserSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export type emailLoginUserInput = z.TypeOf<typeof emailLoginUserSchema>;

export const fetchUserSchema = z.object({
	id: z.string(),
});

export type fetchUserInput = z.TypeOf<typeof fetchUserSchema>;

export const updateUserEmailSchema = z.object({
	id: z.string(),
	email: z.string().email(),
});

export type updateUserEmailInput = z.TypeOf<typeof updateUserEmailSchema>;

export const updateUserPasswordSchema = z
	.object({
		id: z.string(),
		curr_password: z.string().min(8),
		new_password: z.string().min(8),
		confirm_password: z.string().min(8),
	})
	.refine(async (data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type updateUserPasswordInput = z.TypeOf<typeof updateUserPasswordSchema>;

export const updateUserPictureSchema = z.object({
	id: z.string(),
	image: z.string(),
});

export type updateUserPictureInput = z.TypeOf<typeof updateUserPictureSchema>;
