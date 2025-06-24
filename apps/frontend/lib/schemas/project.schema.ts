import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Project name must be at least 3 characters long' }),
  description: z.string().optional(),
  totalBudget: z
    .number()
    .min(0, { message: 'Budget must be a positive number' }),
  expectedCompletion: z.coerce.date().optional(),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
