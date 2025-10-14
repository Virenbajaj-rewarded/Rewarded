import * as z from "zod";

export const storeSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  businessEmail: z.email(),
  businessPhoneNumber: z.string(),
  businessAddress: z.string(),
  tgUsername: z.string().optional(),
  whatsppUsername: z.string().optional(),
  logoUrl: z.string().optional(),
});

export const storesResponseSchema = z.object({
  items: z.array(storeSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type Store = z.infer<typeof storeSchema>;
export type StoresResponse = z.infer<typeof storesResponseSchema>;
