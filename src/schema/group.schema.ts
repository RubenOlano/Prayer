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
