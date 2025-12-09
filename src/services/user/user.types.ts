import { ERole } from '@/enums';
import { ITransaction } from '@/interfaces';

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
