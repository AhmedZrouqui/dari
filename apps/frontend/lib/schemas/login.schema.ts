import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'A valid email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
