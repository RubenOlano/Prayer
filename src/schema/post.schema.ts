import { z } from "zod";

export const createPostSchema = z.object({
	groupId: z.string(),
	content: z
		.string()
		.describe("Content")
		.refine(
			content => content.length > 0,
			content => ({ message: `${content} is not a valid input, please try again` })
		),
	anonymous: z.boolean().optional().default(false),
	duration: z.number().optional(),
	title: z
		.string()
		.describe("Title")
		.refine(
			title => title.length > 0,
			title => ({ message: `${title} is not a valid input, please try again` })
		),
});

export type createPostInput = z.TypeOf<typeof createPostSchema>;

export const fetchGroupPostsSchema = z.object({
	groupId: z.string(),
	limit: z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish(),
});

export const fetchAuthorPostsSchema = z.object({
	userId: z.string(),
});

export const fetchPostWithIdSchema = z.object({
	postId: z.string(),
});

export const deletePostSchema = z.object({
	postId: z.string(),
});

export const toggleLikedPostSchema = z.object({
	postId: z.string(),
});

export const getUserLikedSchema = z.object({
	postId: z.string(),
});

export const fetchNumLikesSchema = z.object({
	postId: z.string(),
});

export const sharePostsSchema = z.object({
	postIds: z.array(z.string()),
});

export const fetchSharedPostsSchema = z.object({
	shareId: z.string(),
});

export const fetchPostFeedSchema = z.object({
	limit: z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish(),
});
