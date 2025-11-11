import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export const confirmCodeValidationSchema = toFormikValidationSchema(
  z
    .object({
      code: z.string().min(6, { message: 'Code must be exactly 6 characters' }),
    })
    .refine(data => data.code.length === 6, {
      message: 'Code must be exactly 6 characters',
      path: ['code'],
    })
);
