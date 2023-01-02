import { handleError } from "./../../utils/errorHandler";
import { protectedProcedure, router } from "./index";
import { fetchUserSchema, updateUserNameSchema, updateUserPictureSchema } from "../../schema/user.schema";

export const userRouter = router({
  getUser: protectedProcedure.input(fetchUserSchema).query(async ({ ctx, input }) => {
    const { id } = input;
    try {
      const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id } });
      return {
        name: user.name,
        email: user.email,
        id: user.id,
        image: user.image,
      };
    } catch (e) {
      throw handleError(e);
    }
  }),
  updateUserName: protectedProcedure.input(updateUserNameSchema).mutation(async ({ ctx, input }) => {
    const id = ctx.session.user.id;
    const { name } = input;
    try {
      const user = await ctx.prisma.user.update({ where: { id }, data: { name } });
      return user;
    } catch (error) {
      throw handleError(error);
    }
  }),
  updateUserImage: protectedProcedure.input(updateUserPictureSchema).mutation(async ({ ctx, input }) => {
    const id = ctx.session.user.id;
    const { image } = input;
    try {
      await ctx.prisma.user.update({ where: { id }, data: { image } });
    } catch (error) {
      throw handleError(error);
    }
  }),
});
