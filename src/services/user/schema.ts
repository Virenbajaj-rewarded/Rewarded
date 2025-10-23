import * as z from 'zod';

export const userSchema = z.object({
  id: z.string(),

  //TODO: Remove that after signup is implemented
  fullName: z.string().nullable(),
  email: z.email(),
  role: z.enum(['ADMIN', 'USER', 'MERCHANT']),
  phone: z.string().nullable(),
  isPhoneConfirmed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const updateUserSchema = z.object({
  email: z.email().optional(),
  phone: z.string().optional(),
  fullName: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type PartialUser = z.infer<typeof updateUserSchema>;

export const balanceSchema = z.object({
  balance: z.number(),
  type: z.enum(['PAID', 'FREE']),
});

export type BalanceType = z.infer<typeof balanceSchema>;
