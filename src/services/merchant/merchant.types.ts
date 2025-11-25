import { EIndustry, ERole } from '@/enums';
import { ILocation } from '@/interfaces/ILocation';
import { IActiveRewardProgram } from '@/interfaces/IStore';

export interface IGetMerchantResponse {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessAddress: string;
  businessCode: string | null;
  activeRewardProgram: IActiveRewardProgram;
  location: ILocation;
  storeType?: EIndustry;
  description?: string;
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
