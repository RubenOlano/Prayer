import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
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
					GroupMembers: {
						create: {
							userId,
						},
					},
					GroupAdmins: {
						create: {
							userId,
						},
					},
					private: isPrivate ?? true,
				},
				include: {
					GroupMembers: true,
					GroupAdmins: true,
				},
			});

			await ctx.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					GroupMember: {
						connect: {
							id: group.GroupMembers[0]?.id,
						},
					},
					GroupAdmins: {
						connect: {
							id: group.GroupAdmins[0]?.id,
						},
					},
				},
			});

			return group;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new TRPCError({
					code: "CONFLICT",
					message: error.message,
				});
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				});
			}
		}
	}),
	getGroups: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.session.user;
		const groups = await ctx.prisma.group.findMany({
			where: {
				GroupMembers: {
					some: {
						userId: id,
					},
				},
			},
		});
		return groups;
	}),
	getGroup: protectedProcedure.input(fetchGroupSchema).query(async ({ ctx, input }) => {
		const { id } = input;
		try {
			const group = await ctx.prisma.group.findUnique({
				where: {
					id,
				},
				include: {
					GroupMembers: {
						include: {
							User: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
						},
					},
				},
			});

			if (!group) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			}

			return group;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			} else if (error instanceof TRPCError) {
				throw error;
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				});
			}
		}
	}),
	fetchUserIsAdmin: protectedProcedure.input(fetchUserIsAdminSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		const userId = ctx.session.user.id;
		try {
			const group = await ctx.prisma.group.findUnique({
				where: {
					id: groupId,
				},
				include: {
					GroupAdmins: true,
				},
			});

			if (!group) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			}

			return group.GroupAdmins.some(admin => admin.userId === userId);
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
	fetchGroupAdmins: protectedProcedure.input(fetchGroupAdminsSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			const group = await ctx.prisma.group.findUnique({
				where: {
					id: groupId,
				},
				include: {
					GroupAdmins: true,
				},
			});

			if (!group) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			}

			return group.GroupAdmins;
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
	fetchGroupNonAdmins: protectedProcedure.input(fetchGroupNonAdminsSchema).query(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			const group = await ctx.prisma.group.findUnique({
				where: {
					id: groupId,
				},
				include: {
					GroupMembers: true,
					GroupAdmins: true,
				},
			});

			if (!group) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			}

			const nonAdmins = group.GroupMembers.filter(member => {
				return !group.GroupAdmins.some(admin => admin.userId === member.userId);
			});

			return nonAdmins;
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
	removeGroupAdmin: protectedProcedure.input(removeGroupAdminSchema).mutation(async ({ ctx, input }) => {
		const { adminId } = input;
		try {
			const groupAdmin = await ctx.prisma.groupAdmins.findUnique({
				where: {
					id: adminId,
				},
			});

			if (!groupAdmin) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group admin not found",
				});
			}

			await ctx.prisma.group.update({
				where: {
					id: groupAdmin.groupId,
				},
				data: {
					GroupAdmins: {
						delete: {
							id: adminId,
						},
					},
				},
			});

			await ctx.prisma.user.update({
				where: {
					id: groupAdmin.userId,
				},
				data: {
					GroupAdmins: {
						delete: {
							id: adminId,
						},
					},
				},
			});

			await ctx.prisma.groupAdmins.delete({
				where: {
					id: adminId,
				},
			});
			return true;
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
	removeGroupMember: protectedProcedure.input(removeUserFromGroupSchema).mutation(async ({ ctx, input }) => {
		const { memberId, groupId } = input;
		try {
			const groupMember = await ctx.prisma.groupMember.findUnique({
				where: {
					id: memberId,
				},
			});

			if (!groupMember) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group member not found",
				});
			}

			await ctx.prisma.group.update({
				where: {
					id: groupId,
				},
				data: {
					GroupMembers: {
						delete: {
							id: memberId,
						},
					},
				},
			});

			await ctx.prisma.user.update({
				where: {
					id: groupMember.userId,
				},
				data: {
					GroupMember: {
						delete: {
							id: memberId,
						},
					},
				},
			});

			await ctx.prisma.groupMember.delete({
				where: {
					id: memberId,
				},
			});

			return true;
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
	deleteGroup: protectedProcedure.input(deleteGroupSchema).mutation(async ({ ctx, input }) => {
		const { groupId } = input;
		try {
			await ctx.prisma.group.update({
				where: {
					id: groupId,
				},
				data: {
					GroupMembers: {
						deleteMany: {},
					},
					GroupAdmins: {
						deleteMany: {},
					},
					GroupInvites: {
						deleteMany: {},
					},
				},
			});

			await ctx.prisma.group.delete({
				where: {
					id: groupId,
				},
			});

			return true;
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
	addGroupAdmin: protectedProcedure.input(addGroupAdminSchema).mutation(async ({ ctx, input }) => {
		const { memberId } = input;
		try {
			const groupMember = await ctx.prisma.groupMember.findUnique({
				where: {
					id: memberId,
				},
			});

			if (!groupMember) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group member not found",
				});
			}

			await ctx.prisma.groupAdmins.create({
				data: {
					Group: {
						connect: {
							id: groupMember.groupId,
						},
					},
					User: {
						connect: {
							id: groupMember.userId,
						},
					},
				},
			});

			return true;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === "P2002") {
					throw new TRPCError({
						code: "CONFLICT",
						message: err.message,
					});
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: err.message,
					});
				}
			} else {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
					cause: err,
				});
			}
		}
	}),
	getExploreGroups: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;
		try {
			// Get all groups that the user is not a member of
			const groups = await ctx.prisma.group.findMany({
				where: {
					AND: [
						{
							NOT: {
								GroupMembers: {
									some: {
										userId,
									},
								},
							},
						},
						{
							NOT: {
								GroupAdmins: {
									some: {
										userId,
									},
								},
							},
						},
						{
							private: false,
						},
					],
				},
				include: {
					GroupMembers: {
						include: {
							User: true,
						},
					},
					GroupAdmins: {
						include: {
							User: true,
						},
					},
					_count: {
						select: {
							GroupMembers: true,
						},
					},
				},
			});

			return groups;
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
	joinGroup: protectedProcedure.input(joinGroupSchema).mutation(async ({ ctx, input }) => {
		const { groupId } = input;
		const userId = ctx.session.user.id;
		try {
			const group = await ctx.prisma.group.findUnique({
				where: {
					id: groupId,
				},
			});

			if (!group) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Group not found",
				});
			}

			const groupMember = await ctx.prisma.groupMember.findUnique({
				where: {
					groupId_userId: {
						groupId,
						userId,
					},
				},
			});

			if (groupMember) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "You are already a member of this group",
				});
			}

			await ctx.prisma.groupMember.create({
				data: {
					Group: {
						connect: {
							id: groupId,
						},
					},
					User: {
						connect: {
							id: userId,
						},
					},
				},
			});

			return true;
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
});
