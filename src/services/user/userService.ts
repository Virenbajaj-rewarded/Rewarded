import { instance } from '@/services/instance';

import { IGetUserResponse } from './user.types';

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
  fetchBalance: async () => {
    const response = await instance.get<number>(`users/me/balance`).json();
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
