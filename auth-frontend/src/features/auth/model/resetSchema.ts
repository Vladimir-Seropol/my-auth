import { z } from 'zod';
import { emailSchema } from './loginSchema';

export const resetSchema = z.object({
  email: emailSchema,
});

export type ResetFormValues = z.infer<typeof resetSchema>;
