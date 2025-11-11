import { instance } from '@/services/instance';

import { IGetStoresResponse, ISavingsResponse } from './stores.types';
import { IStore } from '@/interfaces';

export const StoreServices = {
  fetchMyStores: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await instance
      .get(`users/me/stores`, {
        searchParams: {
          page: pageParam,
          limit: 12,
        },
      })
      .json<IGetStoresResponse>();
    return response;
  },

  fetchRemovedStores: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await instance
      .get(`users/me/stores/excluded`, {
        searchParams: {
          page: pageParam,
          limit: 12,
        },
      })
      .json<IGetStoresResponse>();

    return response;
  },
  fetchStore: async (businessCode: string) => {
    const response = await instance.get(`users/me/stores/code/${businessCode}`).json<IStore>();
    return response;
  },
  fetchSavings: async () => {
    const response = await instance.get(`users/me/savings`).json<ISavingsResponse>();
    return response;
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
