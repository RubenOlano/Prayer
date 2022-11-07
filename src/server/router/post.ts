import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./";
import {
	createPostOutput,
	createPostSchema,
	deletePostSchema,
	fetchAuthorPostsSchema,
	fetchGroupPostsSchema,
	fetchNumLikesSchema,
	fetchPostFeedSchema,
	fetchPostWithIdSchema,
	getUserLikedSchema,
	sharePostsSchema,
	toggleLikedPostSchema,
} from "../../schema/post.schema";

export const postRouter = router({
	createPost: protectedProcedure.input(createPostSchema).mutation(async ({ ctx, input }) => {
		const { groupId, content, anonymous, duration, title } = input;
		const userId = ctx.session.user.id;
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
	}),
	// Returns all posts from a group (anon and non-anon)
	getGroupPosts: protectedProcedure.input(fetchGroupPostsSchema).query(async ({ ctx, input }) => {
		const limit = input.limit ?? 5;
		const { groupId, cursor } = input;
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
			await ctx.prisma.postComment.deleteMany({
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
				take: limit + 1,
				where: {
					groupId,
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: {
					createdAt: "desc",
				},
				include: {
					author: true,
					Group: true,
				},
			});
			let nextCursor: typeof cursor | undefined = undefined;
			if (posts.length > limit) {
				const next = posts.pop();
				nextCursor = next?.id;
			}

			const resPosts = posts.map(post => {
				return {
					content: post.content,
					authorName: post.anonymous ? "Anonymous" : post.author.name,
					groupName: post.Group.name,
					title: post.title,
					id: post.id,
					createdAt: post.createdAt,
					groupId: post.groupId,
					authorImage: post.author.image ?? undefined,
				};
			});

			return { posts: resPosts, nextCursor };
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
	}),
	getAuthorPosts: protectedProcedure.input(fetchAuthorPostsSchema).query(async ({ ctx, input }) => {
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
	}),
	getPost: protectedProcedure.input(fetchPostWithIdSchema).query(async ({ ctx, input }) => {
		const { postId } = input;
		const userId = ctx.session.user.id;
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
					author: true,
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

			return {
				id: post.id,
				authorName: post.anonymous ? "Anonymous" : post.author.name,
				groupName: post.Group.name,
				title: post.title,
				content: post.content,
				createdAt: post.createdAt,
				groupId: post.groupId,
				authorImage: post.anonymous ? undefined : post.author.image ?? undefined,
			};
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
	}),
	deletePost: protectedProcedure.input(deletePostSchema).mutation(async ({ ctx, input }) => {
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
	}),
	toggleLikePost: protectedProcedure.input(toggleLikedPostSchema).mutation(async ({ ctx, input }) => {
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
	}),
	getUserLiked: protectedProcedure.input(getUserLikedSchema).query(async ({ ctx, input }) => {
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
	}),
	getNumberOfLikes: protectedProcedure.input(fetchNumLikesSchema).query(async ({ ctx, input }) => {
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
	}),
	sharePosts: protectedProcedure.input(sharePostsSchema).mutation(async ({ ctx, input }) => {
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
	}),
	getPostFeed: protectedProcedure.input(fetchPostFeedSchema).query(async ({ ctx, input }) => {
		const limit = input.limit ?? 5;
		const { cursor } = input;
		const userId = ctx.session.user.id;
		try {
			const posts = await ctx.prisma.post.findMany({
				take: limit + 1,
				where: {
					Group: {
						GroupMembers: {
							some: {
								userId: userId,
							},
						},
					},
				},
				include: {
					author: true,
					Group: true,
				},
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: { createdAt: "desc" },
				distinct: ["id"],
			});

			let newCursor: typeof cursor | undefined = undefined;
			if (posts.length > limit) {
				const nextItem = posts.pop();
				newCursor = nextItem?.id;
			}

			const resPosts = posts.map(post => {
				return {
					id: post.id,
					authorName: post.anonymous ? "Anonymous" : post.author.name,
					groupName: post.Group.name,
					title: post.title,
					content: post.content,
					createdAt: post.createdAt,
					groupId: post.groupId,
					authorImage: post.anonymous ? undefined : post.author.image ?? undefined,
				};
			});

			return {
				posts: resPosts,
				cursor: newCursor,
			};
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
	}),
});
