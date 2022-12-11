import { handleError } from "./../../utils/errorHandler";
import { protectedProcedure, router } from ".";
import {
	addGroupAdminSchema,
	createGroupSchema,
	deleteGroupSchema,
	fetchGroupAdminsSchema,
	fetchGroupNonAdminsSchema,
	fetchGroupSchema,
	fetchUserIsAdminSchema,
	joinGroupSchema,
	removeGroupAdminSchema,
	removeUserFromGroupSchema,
} from "../../schema/group.schema";

export const groupRouter = router({
	registerGroup: protectedProcedure.input(createGroupSchema).mutation(async ({ ctx, input }) => {
		const { name, description, isPrivate } = input;
		const userId = ctx.session.user.id;
		try {
			const group = await ctx.prisma.group.create({
				data: {
					name,
					description,
					GroupMembers: { create: { userId } },
					GroupAdmins: { create: { userId } },
					private: isPrivate ?? true,
				},
				include: { GroupMembers: true, GroupAdmins: true },
			});

			await ctx.prisma.user.update({
				where: { id: userId },
				data: {
					GroupMember: { connect: { id: group.GroupMembers[0]?.id } },
					GroupAdmins: { connect: { id: group.GroupAdmins[0]?.id } },
				},
			});

			return group;
		} catch (error) {
			throw handleError(error);
		}
	}),
	getGroups: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.session.user;
		try {
			const groups = await ctx.prisma.group.findMany({
				where: { GroupMembers: { some: { userId: id } } },
			});

			return groups;
		} catch (error) {
			throw handleError(error);
		}
	}),
	getGroup: protectedProcedure.input(fetchGroupSchema).query(async ({ ctx, input }) => {
		const { id } = input;
		try {
			const group = await ctx.prisma.group.findUniqueOrThrow({
				where: { id },
				include: { GroupMembers: { include: { User: true } } },
			});
			return group;
		} catch (error) {
			throw handleError(error);
		}
	}),
	fetchUserIsAdmin: protectedProcedure.input(fetchUserIsAdminSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		const userId = ctx.session.user.id;
		try {
			const isAdmin = await ctx.prisma.groupAdmins.count({
				where: { AND: [{ groupId }, { userId }] },
			});
			return isAdmin > 0;
		} catch (error) {
			throw handleError(error);
		}
	}),
	fetchGroupAdmins: protectedProcedure.input(fetchGroupAdminsSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			const admins = await ctx.prisma.groupAdmins.findMany({
				where: { id: groupId },
				include: { User: true },
			});
			return admins;
		} catch (error) {
			throw handleError(error);
		}
	}),
	fetchGroupNonAdmins: protectedProcedure.input(fetchGroupNonAdminsSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			const [groupMembers, groupAdmins] = await Promise.all([
				ctx.prisma.groupMember.findMany({
					where: { groupId: groupId },
					include: { User: true },
				}),
				ctx.prisma.groupAdmins.findMany({ where: { groupId: groupId } }),
			]);

			const nonAdmins = groupMembers.filter(member => {
				return !groupAdmins.some(admin => admin.userId === member.userId);
			});

			return nonAdmins;
		} catch (error) {
			throw handleError(error);
		}
	}),
	removeGroupAdmin: protectedProcedure.input(removeGroupAdminSchema).mutation(async ({ ctx, input }) => {
		const { adminId } = input;
		try {
			const groupAdmin = await ctx.prisma.groupAdmins.findUniqueOrThrow({
				where: { id: adminId },
			});

			await ctx.prisma.$transaction([
				ctx.prisma.group.update({
					where: { id: groupAdmin.groupId },
					data: { GroupAdmins: { delete: { id: adminId } } },
				}),
				ctx.prisma.user.update({
					where: { id: groupAdmin.userId },
					data: { GroupAdmins: { delete: { id: adminId } } },
				}),
				ctx.prisma.groupAdmins.delete({
					where: { id: adminId },
				}),
			]);

			return true;
		} catch (error) {
			throw handleError(error);
		}
	}),
	removeGroupMember: protectedProcedure.input(removeUserFromGroupSchema).mutation(async ({ ctx, input }) => {
		const { memberId, groupId } = input;
		try {
			const groupMember = await ctx.prisma.groupMember.findUniqueOrThrow({
				where: { id: memberId },
			});

			await ctx.prisma.group.update({
				where: { id: groupId },
				data: { GroupMembers: { delete: { id: memberId } } },
			});

			await ctx.prisma.user.update({
				where: { id: groupMember.userId },
				data: { GroupMember: { delete: { id: memberId } } },
			});

			await ctx.prisma.groupMember.delete({ where: { id: memberId } });

			return true;
		} catch (error) {
			throw handleError(error);
		}
	}),
	deleteGroup: protectedProcedure.input(deleteGroupSchema).mutation(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			await ctx.prisma.groupMember.deleteMany({ where: { groupId } });
			await ctx.prisma.groupAdmins.deleteMany({ where: { groupId } });
			await ctx.prisma.groupAdmins.deleteMany({ where: { groupId } });

			await ctx.prisma.group.delete({ where: { id: groupId } });

			return true;
		} catch (error) {
			throw handleError(error);
		}
	}),
	addGroupAdmin: protectedProcedure.input(addGroupAdminSchema).mutation(async ({ ctx, input }) => {
		const { memberId } = input;
		try {
			const groupMember = await ctx.prisma.groupMember.findUniqueOrThrow({
				where: { id: memberId },
			});

			await ctx.prisma.groupAdmins.create({
				data: {
					Group: { connect: { id: groupMember.groupId } },
					User: { connect: { id: groupMember.userId } },
				},
			});

			return true;
		} catch (err) {
			throw handleError(err);
		}
	}),
	getExploreGroups: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		try {
			// Get all groups that the user is not a member of
			const groups = await ctx.prisma.group.findMany({
				where: {
					NOT: {
						OR: [
							{ GroupMembers: { some: { userId } } },
							{ GroupAdmins: { some: { userId } } },
							{ private: true },
						],
					},
				},
				include: {
					GroupMembers: { include: { User: true } },
					GroupAdmins: { include: { User: true } },
					_count: { select: { GroupMembers: true } },
				},
			});

			return groups;
		} catch (e) {
			throw handleError(e);
		}
	}),
	joinGroup: protectedProcedure.input(joinGroupSchema).mutation(async ({ ctx, input }) => {
		const { groupId } = input;
		const userId = ctx.session.user.id;
		try {
			await ctx.prisma.groupMember.create({
				data: { Group: { connect: { id: groupId } }, User: { connect: { id: userId } } },
			});
			return true;
		} catch (e) {
			throw handleError(e);
		}
	}),
});
