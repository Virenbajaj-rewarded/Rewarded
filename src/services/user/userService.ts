import { api } from '@/lib/api';
import { ERole } from '@/enums';

export type User = {
  id: string;
  email: string;
  fullName: string;
  isPhoneConfirmed: boolean;
  phone: string;
  role: ERole;
};

export const UserServices = {
  fetchProfile: async () => {
    const response = await api.get<User>(`users/me`);
    return response.data;
  },
  fetchBalance: async () => {
    const response = await api.get<number>(`/users/me/balance`);
    return response.data;
  },

  fetchUserById: async (id: string) => {
    const response = await api.get<User>(`users/${id}`);
    return response.data;
  },
  updateUser: async (data: Partial<User>) => {
    const response = await api.patch<Partial<User>>(`users/me/profile`, data);
    return response.data;
  },
};
