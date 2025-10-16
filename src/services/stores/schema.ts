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

const percentBackRewardProgramSchema = z.object({
  id: z.string(),
  strategy: z.literal('PERCENT_BACK'),
  percentBack: z.number(),
});

const spendToEarnRewardProgramSchema = z.object({
  id: z.string(),
  strategy: z.literal('SPEND_TO_EARN'),
  rewardPercent: z.number(),
  spendThreshold: z.number(),
});

const activeRewardProgramSchema = z.discriminatedUnion('strategy', [
  percentBackRewardProgramSchema,
  spendToEarnRewardProgramSchema,
]);

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string().nullable(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  activeRewardProgram: activeRewardProgramSchema,
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

export type PercentBackRewardProgram = z.infer<typeof percentBackRewardProgramSchema>;
export type SpendToEarnRewardProgram = z.infer<typeof spendToEarnRewardProgramSchema>;
export type ActiveRewardProgram = z.infer<typeof activeRewardProgramSchema>;
export enum ERewardProgramStrategy {
  PERCENT_BACK = 'PERCENT_BACK',
  SPEND_TO_EARN = 'SPEND_TO_EARN',
}
export const savingsResponseSchema = z.object({
  lifetimeSavingsUsd: z.number(),
  rewardPointsBalance: z.number(),
});

export type SavingsResponseType = z.infer<typeof savingsResponseSchema>;
