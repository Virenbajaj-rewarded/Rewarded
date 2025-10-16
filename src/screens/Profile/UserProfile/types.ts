import { z } from 'zod';

export const userProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'At least 2 characters' }),
  phone: z.string().min(8, { message: 'Phone number is required' }),
  email: z.string().email({ message: 'Invalid email format' }),
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
