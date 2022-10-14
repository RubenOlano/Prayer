import { z } from "zod";

export const fetchAllCommentsSchema = z.object({
	postId: z.string(),
});

export type FetchAllCommentsSchema = z.infer<typeof fetchAllCommentsSchema>;

export const createCommentSchema = z.object({
	postId: z.string(),
	content: z.string(),
	userId: z.string(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
