import { ERole } from '@/enums';

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
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

export interface IOnboardMerchantResponse {
  id: string;
  email: string;
  businessName: string;
}
export interface IHealthCheckResponse {
  status: string;
  uptime: number;
  responseTimeMs: number;
  db: string;
  error: string;
}
