import { handleError } from "./../../utils/errorHandler";
import { protectedProcedure, router } from ".";
import { fetchSharedPostsSchema } from "../../schema/post.schema";

export const shareRouter = router({
  getSharedPage: protectedProcedure.input(fetchSharedPostsSchema).query(async ({ ctx, input }) => {
    const { shareId } = input;
    try {
      const sharePage = await ctx.prisma.shareGroupPosts.findUniqueOrThrow({
        where: { id: shareId },
        include: { PostShare: true },
      });
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
      throw handleError(error);
    }
  }),
});
