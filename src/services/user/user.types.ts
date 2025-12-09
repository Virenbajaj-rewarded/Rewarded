import { ITransaction } from '@/interfaces';
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

export interface IGetTransactionHistoryResponse {
  items: ITransaction[];
  page: number;
  limit: number;
  total: number;
}
