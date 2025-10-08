import { z } from "zod";

export const ledgerRequestSchema = z.object({
  type: z.enum(["EARN", "REDEEM"]), // якщо поки що тільки EARN — можеш лишити z.literal("EARN")
  value: z.object({
    consumerId: z.uuid(),
    idempotencyKey: z.uuid(),
    amount: z.number().int().positive(),
    comment: z.string().optional(),
  }),
});

export const transactionSchema = z.object({
  id: z.string(),
  merchantId: z.uuid(),
  consumerId: z.uuid(),
  type: z.enum(["EARN", "REDEEM"]),
  points: z.number().nonnegative(),
  amountCents: z.number().int().nullable(),
  programId: z.string().nullable(),
  idempotencyKey: z.string(),
  createdAt: z.iso.datetime(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export type LedgerRequest = z.infer<typeof ledgerRequestSchema>;
