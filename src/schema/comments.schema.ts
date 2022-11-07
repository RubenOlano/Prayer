import { z } from "zod";

export const fetchAllCommentsSchema = z.object({
	postId: z
		.string()
		.refine(id => id.length > 0)
		.describe("Post ID"),
});

export const createCommentSchema = z.object({
	postId: z.string(),
	content: z
		.string()
		.describe("Content")
		.refine(content => content.length > 0),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
