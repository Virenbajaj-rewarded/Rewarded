import { EIndustry, ERole } from '@/enums';
import { ILocation, ICustomer, IActiveRewardProgram } from '@/interfaces';

export interface IGetMerchantResponse {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  storeType?: EIndustry;
  description?: string;
  activeRewardProgram?: IActiveRewardProgram;
  location: ILocation;
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

export interface IUpdateMerchantPayload {
  businessName?: string;
  businessEmail?: string;
  businessPhoneNumber?: string;
  location?: ILocation;
  storeType?: EIndustry | null;
  description?: string;
  tgUsername?: string | null;
  whatsppUsername?: string | null;
}

export interface ICustomerStatsResponse {
  totalCustomers: number;
  newCustomersLastMonth: number;
  totalPointsCredited: number;
  totalPointsRedeemed: number;
}

export interface ICustomersResponse {
  items: ICustomer[];
  total: number;
  page: number;
  limit: number;
}
