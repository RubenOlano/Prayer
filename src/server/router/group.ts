import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import {
  createGroupOutput,
  createGroupOutputSchema,
  createGroupSchema,
  fetchGroupSchema,
  fetchGroupsSchema,
  fetchUserIsAdminSchema,
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
          },
        });

        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            GroupMember: {
              create: {
                groupId: group.id,
              },
            },
          },
        });

        const output: createGroupOutput = {
          groupId: group.id,
          name: group.name,
          description: group.description || undefined,
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
                User: true,
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

        return group.GroupAdmins.some((admin) => admin.userId === userId);
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
