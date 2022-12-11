import { handleError } from "./../../utils/errorHandler";
import { protectedProcedure, router } from "./index";
import { createCommentSchema, fetchAllCommentsSchema } from "../../schema/comments.schema";

export const commentRouter = router({
	fetchAllComments: protectedProcedure.input(fetchAllCommentsSchema).query(async ({ ctx, input }) => {
		const { postId } = input;
		try {
			const comments = await ctx.prisma.postComment.findMany({
				where: { postId },
				include: { author: true },
			});
			return comments;
		} catch (err) {
			throw handleError(err);
		}
	}),
	createComment: protectedProcedure.input(createCommentSchema).mutation(async ({ ctx, input }) => {
		const { postId, content } = input;
		const userId = ctx.session.user.id;
		try {
			const new_comment = await ctx.prisma.postComment.create({
				data: {
					content,
					author: { connect: { id: userId } },
					Post: { connect: { id: postId } },
				},
			});
			return new_comment;
		} catch (error) {
			throw handleError(error);
		}
	}),
});
