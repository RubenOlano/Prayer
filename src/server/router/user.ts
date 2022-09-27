import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { createUserSchema } from "../../schema/user.schema";
import { hash } from "../../utils/hash";
import { createRouter } from "./context";

export const userRouter = createRouter().mutation("registerUser", {
  input: createUserSchema,
  resolve: async ({ ctx, input }) => {
    const { fname, lname, email, password, confirmPassword } = input;
    if (password !== confirmPassword) {
      console.log({ password, confirmPassword });

      throw new TRPCError({
        code: "CONFLICT",
        message: "Passwords do not match",
      });
    }
    const user_pass = await hash(password);
    try {
      const user = await ctx.prisma.user.create({
        data: {
          fname,
          lname,
          email,
          password: user_pass,
        },
      });
      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }
  },
});
