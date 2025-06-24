import { z } from 'zod';

export const registrationSchema = z.object({
  // Step 1
  email: z.string().email({ message: 'A valid email is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  // Step 2
  name: z.string().min(2, { message: 'Please enter your full name' }),
  // Step 3
  organizationName: z
    .string()
    .min(3, { message: 'Organization name is required' }),
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
