import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./index";
import { fetchUserSchema, updateUserNameSchema, updateUserPictureSchema } from "../../schema/user.schema";

export const userRouter = router({
	getUser: protectedProcedure.input(fetchUserSchema).query(async ({ ctx, input }) => {
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
				name: user.name,
				email: user.email,
				id: user.id,
				image: user.image,
			};
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === "P2002") {
					throw new TRPCError({
						code: "CONFLICT",
						message: e.message,
					});
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: e.message,
					});
				}
			} else if (e instanceof TRPCError) {
				throw e;
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: e,
				});
			}
		}
	}),
	updateUserName: protectedProcedure.input(updateUserNameSchema).mutation(async ({ ctx, input }) => {
		const { id, name } = input;
		try {
			const user = await ctx.prisma.user.update({
				where: {
					id,
				},
				data: {
					name,
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
	updateUserImage: protectedProcedure.input(updateUserPictureSchema).mutation(async ({ ctx, input }) => {
		const { id, image } = input;
		try {
			await ctx.prisma.user.update({
				where: {
					id,
				},
				data: {
					image,
				},
			});
		} catch (error) {
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
	}),
});
