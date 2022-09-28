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

export const emailLoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type emailLoginUserInput = z.TypeOf<typeof emailLoginUserSchema>;

export const fetchUserSchema = z.object({
  id: z.string(),
});

export type fetchUserInput = z.TypeOf<typeof fetchUserSchema>;
