import { api } from '@/lib/api';

import { IGetStoresResponse, ISavingsResponse } from './stores.types';
import { IStore } from '@/interfaces';
import { EIndustry } from '@/enums';

export const StoreServices = {
  fetchMyStores: async ({
    pageParam = 1,
    storeType,
  }: {
    pageParam?: number;
    storeType?: EIndustry;
  }) => {
    const response = await api.get<IGetStoresResponse>(`/users/me/stores`, {
      params: {
        page: pageParam,
        limit: 12,
        ...(storeType && { storeType }),
      },
    });

    return response.data;
  },

  fetchRemovedStores: async ({ pageParam = 1 }: { pageParam?: number }) => {
    const response = await api.get<IGetStoresResponse>(
      `/users/me/stores/excluded`,
      {
        params: {
          page: pageParam,
          limit: 12,
        },
      }
    );

    return response.data;
  },
  fetchStore: async (businessCode: string) => {
    const response = await api.get<IStore>(
      `/users/me/stores/code/${businessCode}`
    );
    return response.data;
  },
  fetchSavings: async () => {
    const response = await api.get<ISavingsResponse>(`/users/me/savings`);
    return response.data;
  },
  likeStore: async (id: string) => {
    const response = await api.post<{ success: boolean }>(
      `/users/me/stores/${id}/like`
    );
    return response.data.success;
  },
  unlikeStore: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(
      `/users/me/stores/${id}/like`
    );
    return response.data.success;
  },
};
