import { instance } from '@/services/instance';

import { IGetBalanceResponse, IGetUserResponse } from './user.types';

export const UserServices = {
  fetchProfile: async () => {
    try {
      const response = await instance.get<IGetUserResponse>(`users/me`).json();
      return response;
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  },
  fetchCustomerBalance: async () => {
    const response = await instance.get<IGetBalanceResponse>(`users/me/balances`).json();
    return response;
  },
  fetchUserById: async (id: string) => {
    const response = await instance.get<IGetUserResponse>(`users/${id}`).json();
    return response;
  },
  updateUser: async (data: Partial<IGetUserResponse>) => {
    const response = await instance
      .patch<Partial<IGetUserResponse>>(`users/me/profile`, { json: data })
      .json();
    return response;
  },
};
