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
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				cause: e,
				message: "Something went wrong",
			});
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
