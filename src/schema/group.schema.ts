import z from "zod";

export const createGroupSchema = z.object({
	userId: z.string(),
	name: z
		.string()
		.describe("Name")
		.refine(
			name => name.length > 0,
			name => ({ message: `Name must be at least 1 character long, got ${name.length} characters` })
		),
	description: z.string().optional(),
	isPrivate: z.boolean().optional(),
});

export type createGroupInput = z.TypeOf<typeof createGroupSchema>;

export const fetchGroupSchema = z.object({
	id: z.string(),
});

export const fetchUserIsAdminSchema = z.object({
	groupId: z.string(),
});

export const fetchGroupAdminsSchema = z.object({
	groupId: z.string(),
});

export const fetchGroupNonAdminsSchema = z.object({
	groupId: z.string(),
});

export const removeGroupAdminSchema = z.object({
	adminId: z.string(),
});

export const removeUserFromGroupSchema = z.object({
	memberId: z.string(),
	groupId: z.string(),
});

export const deleteGroupSchema = z.object({
	groupId: z.string(),
});

export const addGroupAdminSchema = z.object({
	memberId: z.string(),
});

export const joinGroupSchema = z.object({
	groupId: z.string(),
});
