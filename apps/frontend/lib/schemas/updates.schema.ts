import { z } from 'zod';

export const createUpdateSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters.' }),
  // attachmentIds will be handled separately, not in this form
});

export type CreateUpdateFormValues = z.infer<typeof createUpdateSchema>;
