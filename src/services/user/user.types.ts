import { ERole } from '@/enums';

export interface IGetUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: ERole;
  phone: string;
  isEmailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetMerchantBalanceResponse {
  points: number;
  usd: number;
  usdc: number;
}
