import { api } from '@/lib/api';
import { IGetMerchantResponse, IUpdateMerchantPayload } from './merchant.types';
import { IStore } from '@/interfaces';

export const MerchantServices = {
  fetchMerchantProfile: async () => {
    const response = await api.get<IGetMerchantResponse>(`/merchants/me`);
    return response.data;
  },

  fetchMerchantByBusinessCode: async (businessCode: string) => {
    const response = await api.get<Partial<IStore>>(
      `/merchants/code/${businessCode}`
    );
    return response.data;
  },
  updateMerchant: async (data: IUpdateMerchantPayload) => {
    const response = await api.patch<{ success: boolean }>(`/merchants`, data);
    return response.data;
  },

  uploadMerchantLogo: async (
    logoUri: string,
    fileName: string,
    type: string
  ) => {
    const formData = new FormData();
    formData.append('file', {
      uri: logoUri,
      name: fileName,
      type: type,
    } as unknown as File);

    const response = await api.post(`/merchants/upload-logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
