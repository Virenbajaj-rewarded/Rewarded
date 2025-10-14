import { instance } from "@/services/instance";

import { StoresResponse, storesResponseSchema } from "./schema";

export const StoreServices = {
  fetchMyStores: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await instance
      .get(`users/me/stores`, {
        searchParams: {
          page: pageParam,
          limit: 12,
        },
      })
      .json<StoresResponse>();

    return storesResponseSchema.parse(response);
  },
  fetchRemovedStores: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await instance
      .get(`users/me/stores/excluded`, {
        searchParams: {
          page: pageParam,
          limit: 12,
        },
      })
      .json<StoresResponse>();

    return storesResponseSchema.parse(response);
  },
  deleteStore: async (id: string) => {
    await instance.delete<void>(`users/me/stores/${id}`);
    return id;
  },
  restoreStore: async (id: string) => {
    await instance.post<void>(`users/me/stores/${id}/restore`);
    return id;
  },
};
