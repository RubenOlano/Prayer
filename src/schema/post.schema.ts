import z from "zod";

export const createPostSchema = z.object({
  userId: z.string(),
  groupId: z.string(),
  content: z.string(),
  annonymous: z.boolean().optional(),
  duration: z.number().optional(),
  title: z.string(),
});

export type createPostInput = z.TypeOf<typeof createPostSchema>;

export const createPostOutputSchema = z.object({
  postId: z.string(),
  userId: z.string(),
  groupId: z.string(),
  content: z.string(),
  annonymous: z.boolean(),
});

export type createPostOutput = z.TypeOf<typeof createPostOutputSchema>;

export const fetchGroupPostsSchema = z.object({
  groupId: z.string(),
});

export type fetchGroupPostsInput = z.TypeOf<typeof fetchGroupPostsSchema>;

export const fetchAuthorPostsSchema = z.object({
  userId: z.string(),
});

export const fetchPostWithIdSchema = z.object({
  postId: z.string(),
  userId: z.string(),
});

export type fetchPostWithIdInput = z.TypeOf<typeof fetchPostWithIdSchema>;

export const deletePostSchema = z.object({
  postId: z.string(),
});
