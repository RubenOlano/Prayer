import { z } from "zod";

export const fetchAllCommentsSchema = z.object({
  postId: z
    .string()
    .refine(id => id.length > 0, { message: "Post ID must be a non-empty string" })
    .describe("Post ID"),
});

export const createCommentSchema = z.object({
  postId: z.string(),
  content: z
    .string()
    .describe("Content")
    .refine(content => content.length > 0, { message: "Content must be a non-empty string" }),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
