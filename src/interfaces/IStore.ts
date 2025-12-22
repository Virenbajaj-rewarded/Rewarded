import { EIndustry, EProgramStrategy, EOfferType } from '@/enums';
import { ILocation } from '@/interfaces';

export interface IStore {
  id: string;
  userId: string;
  businessName: string;
  businessCode: string | null;
  businessEmail: string;
  businessPhoneNumber: string;
  tgUsername: string;
  whatsppUsername: string;
  isLiked: boolean;
  distance: number;
  location: ILocation | null;
  storeType: EIndustry;
  logoUrl: string;
  description: string;
  rewardPoints: number;
  spent: number;
  activeRewardProgram: IActiveRewardProgram;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActiveRewardProgram {
  id: string;
  name: string;
  strategy: EProgramStrategy;
  percentBack?: number;
  spendThreshold?: number;
  rewardPercent?: number;
  maxDailyBudget?: number;
  offerType: EOfferType;
}
