import { z } from 'zod';
import { AccountType } from '@dari/types';

export const registrationSchema = z
  .object({
    accountType: z.nativeEnum(AccountType),
    email: z.string().email({ message: 'A valid email is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    name: z.string().min(2, { message: 'Please enter your full name' }),
    organizationName: z.string().optional(),
  })
  .refine(
    (data) => {
      // organizationName is only required if the accountType is DEVELOPER
      if (data.accountType === AccountType.DEVELOPER) {
        return !!data.organizationName && data.organizationName.length >= 3;
      }
      return true;
    },
    {
      message: 'Organization name is required for developer accounts.',
      path: ['organizationName'], // Specify which field the error applies to
    }
  );

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
