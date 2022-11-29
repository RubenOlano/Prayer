import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./index";
import { createCommentSchema, fetchAllCommentsSchema } from "../../schema/comments.schema";

export const commentRouter = router({
	fetchAllComments: protectedProcedure.input(fetchAllCommentsSchema).query(async ({ ctx, input }) => {
		const { postId } = input;
		try {
			const comments = await ctx.prisma.postComment.findMany({
				where: {
					postId,
				},
				include: {
					author: true,
				},
			});
			return comments;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2025") {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Post not found",
					});
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: err.message,
					});
				}
			} else if (err instanceof TRPCError) {
				throw err;
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: err,
				});
			}
		}
	}),
	createComment: protectedProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
		const { postId, content } = input;
		const userId = ctx.session.user.id;
		try {
			const new_comment = await ctx.prisma.postComment.create({
				data: {
					content,
					author: {
						connect: {
							id: userId,
						},
					},
					Post: {
						connect: {
							id: postId,
						},
					},
				},
				include: {
					author: true,
				},
			});
			return new_comment;
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
						cause: error,
					});
				}
			} else if (error instanceof TRPCError) {
				throw error;
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: error,
				});
			}
		}
	}),
});
