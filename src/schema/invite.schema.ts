import { z } from "zod";

export const fetchInviteSchema = z.object({
	groupId: z.string(),
	userId: z.string(),
});

export type fetchInviteSchemaInput = z.TypeOf<typeof fetchInviteSchema>;

export const addUserToGroup = z.object({
	userId: z.string(),
	inviteId: z.string(),
});

export const fetchGroupFromInviteSchema = z.object({
	inviteId: z.string(),
});