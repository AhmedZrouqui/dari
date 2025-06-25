import { z } from 'zod';

export const addMilestoneSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Milestone name must be at least 3 characters.' }),
  description: z.string().optional(),
  targetDate: z.coerce.date().optional(),
});

export type AddMilestoneValues = z.infer<typeof addMilestoneSchema>;
