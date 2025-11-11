import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

export const userValidationSchema = toFormikValidationSchema(
  z
    .object({
      fullName: z.string().min(2, { message: 'At least 2 characters' }),
      email: z.string().email({ message: 'Invalid email format' }),
      phoneNumber: z.string().min(8, { message: 'Phone number is required' }),
      password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
      confirmPassword: z.string().min(8, { message: 'Password confirmation is required' }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    })
);
