import z from "zod";

export const fetchUserSchema = z.object({
	id: z.string(),
});

export type fetchUserInput = z.TypeOf<typeof fetchUserSchema>;

export const updateUserNameSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type updateUserNameInput = z.TypeOf<typeof updateUserNameSchema>;

export const updateUserPictureSchema = z.object({
	id: z.string(),
	image: z.string(),
});

export type updateUserPictureInput = z.TypeOf<typeof updateUserPictureSchema>;
