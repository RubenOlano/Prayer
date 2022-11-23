import z from "zod";

export const fetchUserSchema = z.object({
	id: z.string(),
});

export const updateUserNameSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.describe("Name")
		.refine(
			name => name.length > 0,
			name => ({ message: `Name must be at least 1 character long, got ${name.length} characters` })
		),
});

export type updateUserNameInput = z.TypeOf<typeof updateUserNameSchema>;

export const updateUserPictureSchema = z.object({
	id: z.string(),
	image: z
		.string()
		.describe("Image")
		.refine(
			image => image.length > 0,
			img => ({ message: `${img} is not more than 10 characters` })
		),
});
