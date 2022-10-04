import z from "zod";

export const createGroupSchema = z.object({
	userId: z.string(),
	name: z.string(),
	description: z.string().optional(),
});

export type createGroupInput = z.TypeOf<typeof createGroupSchema>;

export const createGroupOutputSchema = z.object({
	groupId: z.string(),
	name: z.string(),
	description: z.string().optional(),
});

export type createGroupOutput = z.TypeOf<typeof createGroupOutputSchema>;

export const fetchGroupsSchema = z.object({
	userId: z.string(),
});

export type fetchGroupsInput = z.TypeOf<typeof fetchGroupsSchema>;

export const fetchGroupSchema = z.object({
	id: z.string(),
});

export const fetchUserIsAdminSchema = z.object({
	userId: z.string(),
	groupId: z.string(),
});

export type fetchUserIsAdminInput = z.TypeOf<typeof fetchUserIsAdminSchema>;

export const fetchGroupAdminsSchema = z.object({
	groupId: z.string(),
});

export type fetchGroupAdminsInput = z.TypeOf<typeof fetchGroupAdminsSchema>;

export const fetchGroupNonAdminsSchema = z.object({
	groupId: z.string(),
});

export type fetchGroupNonAdminsInput = z.TypeOf<
	typeof fetchGroupNonAdminsSchema
>;

export const removeGroupAdminSchema = z.object({
	adminId: z.string(),
});

export type removeGroupAdminInput = z.TypeOf<typeof removeGroupAdminSchema>;

export const removeUserFromGroupSchema = z.object({
	memberId: z.string(),
});

export type removeUserFromGroupInput = z.TypeOf<
	typeof removeUserFromGroupSchema
>;

export const deleteGroupSchema = z.object({
	groupId: z.string(),
});

export type deleteGroupInput = z.TypeOf<typeof deleteGroupSchema>;
