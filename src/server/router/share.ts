import { TRPCError } from "@trpc/server";
import { fetchSharedPostsSchema } from "../../schema/post.schema";
import { createRouter } from "./context";

export const shareRouter = createRouter().query("getSharePage", {
	input: fetchSharedPostsSchema,
	resolve: async ({ ctx, input }) => {
		const { shareId } = input;
		try {
			const sharePage = await ctx.prisma.shareGroupPosts.findUnique({
				where: { id: shareId },
				include: {
					PostShare: true,
				},
			});
			if (!sharePage) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Share page not found",
				});
			}

			const publicPosts = await ctx.prisma.post.findMany({
				where: {
					AND: [{ id: { in: sharePage.PostShare.map(post => post.postId) } }, { anonymous: false }],
				},
				include: {
					author: true,
				},
			});

			const anonymousPosts = await ctx.prisma.post.findMany({
				where: {
					AND: [{ id: { in: sharePage.PostShare.map(post => post.postId) } }, { anonymous: true }],
				},
				select: {
					id: true,
					content: true,
					title: true,
				},
			});

			return {
				nonAnonymousPosts: publicPosts,
				anonymousPosts,
			};
		} catch (error) {
			if (error instanceof TRPCError) {
				throw new TRPCError({
					code: error.code,
					message: error.message,
				});
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
