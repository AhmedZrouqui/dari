import { z } from 'zod';

export const createInvestmentSchema = z.object({
  investorEmail: z.string().email({ message: 'A valid email is required.' }),
  amount: z
    .number()
    .min(1, { message: 'Investment amount must be greater than 0.' }),
  equityPercentage: z
    .number()
    .min(0, { message: 'Equity must be at least 0.' })
    .max(100, { message: 'Equity cannot exceed 100.' }),
});

export type CreateInvestmentFormValues = z.infer<typeof createInvestmentSchema>;
