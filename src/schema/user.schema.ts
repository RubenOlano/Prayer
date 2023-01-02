import z from "zod";

export const fetchUserSchema = z.object({
  id: z.string(),
});

export const updateUserNameSchema = z.object({
  name: z
    .string()
    .describe("Name")
    .refine(
      name => name.length > 0,
      name => ({ message: `${name} is an invalid name, please try again` })
    ),
});

export type updateUserNameInput = z.TypeOf<typeof updateUserNameSchema>;

export const updateUserPictureSchema = z.object({
  image: z.string().describe("Image").url("Image must be a valid URL"),
});
