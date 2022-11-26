import z from "zod";

export const createGroupSchema = z.object({
	name: z
		.string()
		.describe("Name")
		.refine(
			name => name.length > 0,
			name => ({ message: `${name} is an invalid group name, please try again` })
		),
	description: z.string().optional().describe("A group's description"),
	isPrivate: z.boolean().optional().describe("Whether or not a group is private").default(true),
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
