import { protectedProcedure, router } from ".";
import { addUserToGroup, fetchGroupFromInviteSchema, fetchInviteSchema } from "../../schema/invite.schema";
import { handleError } from "../../utils/errorHandler";

export const inviteRouter = router({
  createInvite: protectedProcedure.input(fetchInviteSchema).mutation(async ({ input, ctx }) => {
    const { groupId } = input;
    const userId = ctx.session.user.id;
    try {
      const { Group } = await ctx.prisma.groupAdmins.findFirstOrThrow({
        where: { AND: { groupId, userId } },
        include: { Group: { include: { GroupInvites: true } } },
      });

      const invite = await ctx.prisma.groupInvites.findFirst({ where: { groupId } });
      if (!invite) {
        const invite = await ctx.prisma.groupInvites.create({
          data: { Group: { connect: { id: Group.id } } },
        });
        return invite;
      }

      return invite;
    } catch (error) {
      throw handleError(error);
    }
  }),
  addUserToGroup: protectedProcedure.input(addUserToGroup).mutation(async ({ ctx, input }) => {
    const { inviteId } = input;
    const userId = ctx.session.user.id;
    try {
      const invite = await ctx.prisma.groupInvites.findUniqueOrThrow({
        where: { id: inviteId },
        include: { Group: true },
      });
      const group = invite.Group;

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
      const groupMember = await ctx.prisma.groupMember.create({
        data: {
          Group: { connect: { id: group.id } },
          User: { connect: { id: user.id } },
        },
      });
      return groupMember;
    } catch (e) {
      throw handleError(e);
    }
  }),
  getGroupFromInvite: protectedProcedure.input(fetchGroupFromInviteSchema).query(async ({ ctx, input }) => {
    const { inviteId } = input;
    try {
      const invite = await ctx.prisma.groupInvites.findUniqueOrThrow({
        where: { id: inviteId },
        include: { Group: true },
      });

      return invite.Group;
    } catch (e) {
      throw handleError(e);
    }
  }),
});
