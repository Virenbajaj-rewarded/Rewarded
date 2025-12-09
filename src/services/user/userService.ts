import { api } from '@/lib/api';
import { IGetTransactionHistoryResponse, IGetUserResponse } from './user.types';

export const UserServices = {
  fetchProfile: async () => {
    const response = await api.get<IGetUserResponse>(`users/me`);
    return response.data;
  },
  fetchBalance: async () => {
    const response = await api.get<number>(`/users/me/balance`);
    return response.data;
  },

  fetchUserById: async (id: string) => {
    const response = await api.get<IGetUserResponse>(`users/${id}`);
    return response.data;
  },
  updateUser: async (data: Partial<IGetUserResponse>) => {
    const response = await api.patch<Partial<IGetUserResponse>>(
      `users/me/profile`,
      data
    );
    return response.data;
  },
  fetchTransactionHistory: async ({
    pageParam = 1,
  }: {
    pageParam?: number;
  }) => {
    const response = await api.get<IGetTransactionHistoryResponse>(
      `/users/me/transactions`,
      {
        params: {
          page: pageParam,
          limit: 12,
        },
      }
    );
    return response.data;
  },
};
