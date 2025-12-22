import { instance } from '@/services/instance';

import { IGetStoresResponse } from './stores.types';
import { IStore } from '@/interfaces';
import { EIndustry } from '@/enums';

export const StoreServices = {
  fetchAllStores: async ({
    pageParam = 1,
    storeType,
    search,
  }: {
    pageParam?: number;
    storeType?: EIndustry | null;
    search?: string;
  }) => {
    const response = await instance
      .get(`users/me/discover`, {
        searchParams: {
          page: pageParam,
          limit: 12,
          ...(storeType && { storeType }),
          ...(search && { search }),
        },
      })
      .json<IGetStoresResponse>();
    return response;
  },

  fetchMyStores: async ({
    pageParam = 1,
    storeType,
  }: {
    pageParam?: number;
    storeType?: EIndustry | null;
  }) => {
    const response = await instance
      .get(`users/me/stores`, {
        searchParams: {
          page: pageParam,
          limit: 12,
          ...(storeType && { storeType }),
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
  likeStore: async (id: string) => {
    const response = await instance.post<{ success: boolean }>(`users/me/stores/${id}/like`).json();
    return response.success;
  },
  unlikeStore: async (id: string) => {
    const response = await instance
      .delete(`users/me/stores/${id}/like`)
      .json<{ success: boolean }>();
    return response.success;
  },
};
