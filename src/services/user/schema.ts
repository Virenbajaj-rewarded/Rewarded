import * as z from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(["ADMIN", "USER", "MERCHANT"]),
  phone: z.string().nullable(),
  isPhoneConfirmed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;

export const balanceSchema = z.object({
  balance: z.number(),
  type: z.enum(["PAID", "FREE"]),
});

export type BalanceType = z.infer<typeof balanceSchema>;
