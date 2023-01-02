import { z } from "zod";

export const fetchInviteSchema = z.object({
  groupId: z.string(),
});

export const addUserToGroup = z.object({
  inviteId: z.string(),
});

export const fetchGroupFromInviteSchema = z.object({
  inviteId: z.string(),
});
