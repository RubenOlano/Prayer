import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { createCommentSchema, fetchAllCommentsSchema } from "../../schema/comments.schema";
import { createProtectedRouter } from "./context";

export const commentRouter = createProtectedRouter()
	.query("fetchAllComments", {
		input: fetchAllCommentsSchema,
		resolve: async ({ ctx, input }) => {
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
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Something went wrong",
					});
				}
			}
		},
	})
	.mutation("createComment", {
		input: createCommentSchema,
		resolve: async ({ ctx, input }) => {
			const { postId, content, userId } = input;
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
	});
