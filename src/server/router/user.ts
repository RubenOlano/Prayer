import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { createUserSchema, fetchUserSchema, updateUserEmailSchema, updateUserPasswordSchema, updateUserPictureSchema } from "../../schema/user.schema";
import { compare, hash } from "../../utils/hash";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .mutation("registerUser", {
    input: createUserSchema,
    resolve: async ({ ctx, input }) => {
      const { fname, lname, email, password, confirmPassword } = input;
      if (password !== confirmPassword) {
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
  })
  .query("getUser", {
    input: fetchUserSchema,
    resolve: async ({ ctx, input }) => {
      const { id } = input;
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id,
          },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }
        return {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          id: user.id,
          image: user.image
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: e,
          message: "Something went wrong",
        });
      }
    },
  }).mutation("updateUserEmail", {
    input: updateUserEmailSchema,
    resolve: async ({ ctx, input }) => {
      const { id, email } = input;
      try {
        const user = await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            email,
          },
        });
        return user;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User with that email already exists",
            });
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong",
            });
          }
        }
      }
    }
  })
  .mutation("updateUserPassword", {
    input: updateUserPasswordSchema,
    resolve: async ({ ctx, input }) => {
      const { id, curr_password, new_password, confirm_password } = input;
      if (new_password !== confirm_password) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Passwords do not match",
        });
      }
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const valid = await compare(curr_password, user.password);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password",
        });
      }
      const user_pass = await hash(new_password);
      try {
        const updatedUser = await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            password: user_pass,
          },
        });
        return updatedUser;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  }).mutation("updateUserImage", {
    input: updateUserPictureSchema,
    resolve: async ({ ctx, input }) => {
      const { id, image } = input;

      try {
        await ctx.prisma.user.update({
          where: {
            id,
          },
          data: {
            image,
          },
        })
      } catch (error) {
        console.log(error);

        if (error instanceof PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
            cause: error,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }

    }
  });