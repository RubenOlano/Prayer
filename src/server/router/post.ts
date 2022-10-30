import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
	createPostOutput,
	createPostOutputSchema,
	createPostSchema,
	deletePostSchema,
	fetchAuthorPostsSchema,
	fetchGroupPostsSchema,
	fetchNumLikesSchema,
	fetchPostWithIdSchema,
	getUserLikedSchema,
	sharePostsSchema,
	toggleLikedPostSchema,
} from "../../schema/post.schema";
import { createProtectedRouter } from "./context";

export const postRouter = createProtectedRouter()
	.mutation("createPost", {
		input: createPostSchema,
		resolve: async ({ ctx, input }) => {
			const { userId, groupId, content, anonymous, duration, title } = input;
			let new_duration = duration;
			try {
				if (!new_duration) {
					// Default duration is 1 week
					new_duration = 604800000;
				}

				const final_day = new Date(Date.now() + new_duration);

				const post = await ctx.prisma.post.create({
					data: {
						author: {
							connect: {
								id: userId,
							},
						},
						Group: {
							connect: {
								id: groupId,
							},
						},
						content,
						anonymous,
						Duration: final_day,
						title,
					},
				});

				await ctx.prisma.group.update({
					where: {
						id: groupId,
					},
					data: {
						posts: {
							connect: {
								id: post.id,
							},
						},
					},
				});

				await ctx.prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						Posts: {
							connect: {
								id: post.id,
							},
						},
					},
				});
				return {
					anonymous: post.anonymous,
					content: post.content,
					groupId: post.groupId,
					postId: post.id,
					userId: post.authorId,
				} as createPostOutput;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Something went wrong",
						cause: error,
					});
				}
			}
		},
		output: createPostOutputSchema,
	})
	.query("getGroupPosts", {
		input: fetchGroupPostsSchema,
		resolve: async ({ ctx, input }) => {
			const { groupId } = input;
			try {
				// Delete posts that have expired
				await ctx.prisma.postShare.deleteMany({
					where: {
						post: {
							Duration: {
								lte: new Date(),
							},
						},
					},
				});
				await ctx.prisma.likedPost.deleteMany({
					where: {
						Post: {
							Duration: {
								lte: new Date(),
							},
						},
					},
				});
				await ctx.prisma.post.deleteMany({
					where: {
						Duration: { lte: new Date() },
					},
				});
				const posts = await ctx.prisma.post.findMany({
					where: {
						AND: [
							{
								groupId,
							},
							{
								anonymous: false,
							},
						],
					},
					include: {
						author: true,
					},
				});
				return posts;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Something went wrong",
					});
				}
			}
		},
	})
	.query("getAnonPosts", {
		input: fetchGroupPostsSchema,
		resolve: async ({ ctx, input }) => {
			const { groupId } = input;
			try {
				const posts = await ctx.prisma.post.findMany({
					where: {
						Group: {
							id: groupId,
						},
						anonymous: true,
					},
					select: {
						content: true,
						title: true,
						Duration: true,
						id: true,
					},
				});
				return posts;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Something went wrong",
					});
				}
			}
		},
	})
	.query("getAuthorPosts", {
		input: fetchAuthorPostsSchema,
		resolve: async ({ ctx, input }) => {
			const { userId } = input;
			try {
				// Delete posts that have expired
				await ctx.prisma.postShare.deleteMany({
					where: {
						post: {
							Duration: {
								lte: new Date(),
							},
						},
					},
				});
				await ctx.prisma.likedPost.deleteMany({
					where: {
						Post: {
							Duration: {
								lte: new Date(),
							},
						},
					},
				});
				await ctx.prisma.post.deleteMany({
					where: {
						Duration: { lte: new Date() },
					},
				});
				const posts = await ctx.prisma.post.findMany({
					where: {
						authorId: userId,
						Duration: { gt: new Date() },
					},
					include: {
						Group: true,
					},
				});
				return posts;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				}
			}
		},
	})
	.query("getPost", {
		input: fetchPostWithIdSchema,
		resolve: async ({ ctx, input }) => {
			const { postId, userId } = input;
			try {
				const post = await ctx.prisma.post.findUnique({
					where: {
						id: postId,
					},
					include: {
						Group: {
							include: {
								GroupMembers: true,
							},
						},
					},
				});

				if (!post) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Post not found",
					});
				}
				const isMember = post.Group?.GroupMembers.some(member => {
					return member.userId === userId;
				});
				if (!isMember) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "You are not a member of this group",
					});
				}

				return post;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				}
			}
		},
	})
	.mutation("deletePost", {
		input: deletePostSchema,
		resolve: async ({ ctx, input }) => {
			const { postId } = input;
			try {
				const post = await ctx.prisma.post.findUnique({
					where: {
						id: postId,
					},
				});
				if (!post) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Post not found",
					});
				}

				await ctx.prisma.postComment.deleteMany({
					where: {
						postId,
					},
				});

				await ctx.prisma.post.delete({
					where: {
						id: postId,
					},
					include: {
						PostComment: true,
					},
				});

				return true;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				}
			}
		},
	})
	.mutation("toggleLikePost", {
		input: toggleLikedPostSchema,
		resolve: async ({ ctx, input }) => {
			const { postId } = input;
			const userId = ctx.session.user.id;
			try {
				const likedPost = await ctx.prisma.likedPost.findUnique({
					where: { postId_userId: { postId, userId } },
				});

				if (likedPost) {
					await ctx.prisma.likedPost.update({
						where: { id: likedPost.id },
						data: {
							liked: !likedPost.liked,
						},
					});
					return false;
				}
				await ctx.prisma.likedPost.create({
					data: {
						Post: { connect: { id: postId } },
						User: { connect: { id: userId } },
						liked: true,
					},
				});
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						cause: error,
					});
				}
			}
		},
	})
	.query("getUserLiked", {
		input: getUserLikedSchema,
		resolve: async ({ ctx, input }) => {
			const { postId } = input;
			const userId = ctx.session.user.id;
			try {
				const likedPost = await ctx.prisma.likedPost.findUnique({
					where: { postId_userId: { postId, userId } },
				});
				return likedPost?.liked || false;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						cause: error,
					});
				}
			}
		},
	})
	.query("getNumberOfLikes", {
		input: fetchNumLikesSchema,
		resolve: async ({ ctx, input }) => {
			const { postId } = input;
			try {
				const count = await ctx.prisma.likedPost.count({
					where: {
						AND: [{ postId }, { liked: true }],
					},
				});
				return count;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						cause: error,
					});
				}
			}
		},
	})
	.mutation("sharePosts", {
		input: sharePostsSchema,
		resolve: async ({ ctx, input }) => {
			const { postIds } = input;
			try {
				const postsToShare = await ctx.prisma.$transaction(
					postIds.map(postId =>
						ctx.prisma.postShare.create({
							data: {
								post: { connect: { id: postId } },
							},
						})
					)
				);

				const sharePage = await ctx.prisma.shareGroupPosts.create({
					data: {
						PostShare: { connect: postsToShare.map(post => ({ id: post.id })) },
					},
				});

				return sharePage.id;
			} catch (error) {
				if (error instanceof PrismaClientKnownRequestError) {
					if (error.code === "P2002") {
						throw new TRPCError({
							code: "CONFLICT",
							message: error.message,
						});
					} else {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: error.message,
						});
					}
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						cause: error,
					});
				}
			}
		},
	});
