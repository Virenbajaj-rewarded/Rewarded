import { ERole } from '@/enums';

export interface IGetMerchantResponse {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessAddress: string;
  businessCode: string | null;
  tgUsername: string | null;
  whatsppUsername: string | null;
  logoKey: string | null;
  status: string;
  suspendReason: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: ERole;
  };
  logoUrl: string;
}

export interface IGetMerchantBalanceResponse {
  points: number;
  usd: number;
  usdc: number;
}
