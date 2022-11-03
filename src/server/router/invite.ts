import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from ".";
import { addUserToGroup, fetchGroupFromInviteSchema, fetchInviteSchema } from "../../schema/invite.schema";

export const inviteRouter = router({
	createInvite: protectedProcedure.input(fetchInviteSchema).mutation(async ({ input, ctx }) => {
		const { groupId, userId } = input;
		try {
			const isAdmin = await ctx.prisma.groupAdmins.findMany({
				where: {
					AND: {
						groupId,
						userId,
					},
				},
			});
			if (!isAdmin) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Unauthorized request to make an invite",
				});
			}
			const group = await ctx.prisma.group.findUnique({
				where: {
					id: groupId,
				},
				include: {
					GroupInvites: true,
				},
			});
			if (!group) {
				throw new TRPCError({
					message: "Error finding group",
					code: "BAD_REQUEST",
				});
			}
			if (group.GroupInvites.length > 0 && group.GroupInvites[0]) {
				return group.GroupInvites[0];
			} else {
				const invite = await ctx.prisma.groupInvites.create({
					data: {
						groupId,
					},
				});
				return invite;
			}
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
	}),
	addUserToGroup: protectedProcedure.input(addUserToGroup).mutation(async ({ ctx, input }) => {
		const { userId, inviteId } = input;
		try {
			const invite = await ctx.prisma.groupInvites.findUnique({
				where: {
					id: inviteId,
				},
				include: {
					Group: true,
				},
			});
			if (!invite) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invite not found",
				});
			}
			const group = invite.Group;
			if (!group) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Group not found",
				});
			}
			const user = await ctx.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
			if (!user) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found",
				});
			}
			const groupMember = await ctx.prisma.groupMember.create({
				data: {
					groupId: group.id,
					userId: user.id,
				},
			});
			return groupMember;
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
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: e,
				});
			}
		}
	}),
	getGroupFromInvite: protectedProcedure.input(fetchGroupFromInviteSchema).query(async ({ ctx, input }) => {
		const { inviteId } = input;
		try {
			const invite = await ctx.prisma.groupInvites.findUnique({
				where: {
					id: inviteId,
				},
				include: {
					Group: true,
				},
			});
			if (!invite) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invite not found",
				});
			}
			const group = invite.Group;
			if (!group) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Group not found",
				});
			}
			return group;
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
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: e,
				});
			}
		}
	}),
});
