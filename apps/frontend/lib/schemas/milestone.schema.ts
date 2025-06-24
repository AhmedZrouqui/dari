import z from 'zod';

export const addMilestoneSchema = z.object({
  name: z.string().min(3, 'Milestone name is required.'),
});

export type AddMilestoneValues = z.infer<typeof addMilestoneSchema>;
