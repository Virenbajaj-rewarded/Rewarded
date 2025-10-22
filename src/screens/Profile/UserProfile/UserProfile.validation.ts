import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export const userProfileValidationSchema = toFormikValidationSchema(
  z.object({
    fullName: z.string().min(2, { message: 'At least 2 characters' }),
    email: z.string().email({ message: 'Invalid email format' }),
    phone: z.string().min(8, { message: 'Phone number is required' }),
  })
);
