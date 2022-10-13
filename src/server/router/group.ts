import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
	createGroupOutput,
	createGroupOutputSchema,
	createGroupSchema,
	deleteGroupSchema,
	fetchGroupAdminsSchema,
	fetchGroupNonAdminsSchema,
	fetchGroupSchema,
	fetchGroupsSchema,
	fetchUserIsAdminSchema,
	removeGroupAdminSchema,
	removeUserFromGroupSchema,
} from "../../schema/group.schema";
import { createProtectedRouter } from "./context";

export const groupRouter = createProtectedRouter()
	.mutation("registerGroup", {
		input: createGroupSchema,
		output: createGroupOutputSchema,
		resolve: async ({ ctx, input }) => {
			const { name, description, userId } = input;
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

				const output: createGroupOutput = {
					groupId: group.id,
					name: group.name,
					description: group?.description || undefined,
				};
				return output;
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
		},
	})
	.query("getGroups", {
		input: fetchGroupsSchema,
		resolve: async ({ ctx, input }) => {
			const { userId } = input;
			const groups = await ctx.prisma.group.findMany({
				where: {
					GroupMembers: {
						some: {
							userId,
						},
					},
				},
			});
			return groups;
		},
	})
	.query("getGroup", {
		input: fetchGroupSchema,
		resolve: async ({ ctx, input }) => {
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
				} else {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Something went wrong",
					});
				}
			}
		},
	})
	.query("fetchUserIsAdmin", {
		input: fetchUserIsAdminSchema,
		resolve: async ({ ctx, input }) => {
			const { userId, groupId } = input;
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

				return group.GroupAdmins.some(
					(admin) => admin.userId === userId
				);
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
		},
	})
	.query("fetchGroupAdmins", {
		input: fetchGroupAdminsSchema,
		resolve: async ({ ctx, input }) => {
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
		},
	})
	.query("fetchGroupNonAdmins", {
		input: fetchGroupNonAdminsSchema,
		resolve: async ({ ctx, input }) => {
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

				const nonAdmins = group.GroupMembers.filter((member) => {
					return !group.GroupAdmins.some(
						(admin) => admin.userId === member.userId
					);
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
		},
	})
	.mutation("removeGroupAdmin", {
		input: removeGroupAdminSchema,
		resolve: async ({ ctx, input }) => {
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
		},
	})
	.mutation("removeGroupMember", {
		input: removeUserFromGroupSchema,
		resolve: async ({ ctx, input }) => {
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

				await ctx.prisma.group.update({
					where: {
						id: groupMember.groupId,
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
		},
	})
	.mutation("deleteGroup", {
		input: deleteGroupSchema,
		resolve: async ({ ctx, input }) => {
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
		},
	});
