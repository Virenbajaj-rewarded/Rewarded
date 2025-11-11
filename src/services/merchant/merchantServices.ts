import { instance } from '@/services/instance';
import { IGetMerchantBalanceResponse, IGetMerchantResponse } from './merchant.types';
import { IStore } from '@/interfaces/IStore';

export const MerchantServices = {
  fetchMerchantProfile: async () => {
    const response = await instance.get<IGetMerchantResponse>(`merchants/me`).json();
    return response;
  },
  fetchMerchantBalance: async () => {
    const response = await instance.get<IGetMerchantBalanceResponse>(`merchants/balance`).json();
    return response;
  },

  fetchMerchantByBusinessCode: async (businessCode: string) => {
    const response = await instance.get(`merchants/code/${businessCode}`).json<Partial<IStore>>();
    return response;
  },
};
