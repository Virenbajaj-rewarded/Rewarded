import * as z from 'zod';

export const storeListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().optional(),
  rewardPoints: z.number(),
  distance: z.number(),
  // TODO: add enum
  storeType: z.string(),
});

export const storesResponseSchema = z.object({
  items: z.array(storeListItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
});

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  // discount: z.number(),
  // TODO: add enum
  storeType: z.string(),
  logoUrl: z.string().optional(),
  distance: z.number(),
  lifetimeSavings: z.number(),
  rewardPoints: z.number(),
  spent: z.number(),
});

export type StoreListItemType = z.infer<typeof storeListItemSchema>;
export type StoresResponseType = z.infer<typeof storesResponseSchema>;
export type StoreType = z.infer<typeof storeSchema>;

export const savingsResponseSchema = z.object({
  lifetimeSavingsUsd: z.number(),
  rewardPointsBalance: z.number(),
});

export type SavingsResponseType = z.infer<typeof savingsResponseSchema>;
