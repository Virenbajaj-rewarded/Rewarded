import { instance } from '@/services/instance';
import { IGetMerchantResponse, IUpdateMerchantPayload } from './merchant.types';
import { IStore } from '@/interfaces/IStore';

export const MerchantServices = {
  fetchMerchantProfile: async () => {
    const response = await instance.get<IGetMerchantResponse>(`merchants/me`).json();
    return response;
  },

  fetchMerchantByBusinessCode: async (businessCode: string) => {
    const response = await instance.get(`merchants/code/${businessCode}`).json<Partial<IStore>>();
    return response;
  },

  updateMerchant: async (data: IUpdateMerchantPayload) => {
    const response = await instance.patch<{ success: boolean }>(`merchants`, { json: data }).json();
    return response;
  },

  uploadMerchantLogo: async (logoUri: string, fileName: string, type: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: logoUri,
      name: fileName,
      type: type,
    } as unknown);

    const response = await instance.post(`merchants/upload-logo`, { body: formData }).json();
    return response;
  },
};
