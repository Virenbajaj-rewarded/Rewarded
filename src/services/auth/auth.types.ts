import { ERole } from '@/enums';

export interface IHealthCheckResponse {
  status: string;
  uptime: number;
  responseTimeMs: number;
  db: string;
  error: string;
}
export interface ISignupUserResponse {
  email: string;
  id: string;
  isEmailConfirmed: boolean;
  phoneNumber: string;
  role: ERole;
}

export interface ISignupMerchantResponse {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
