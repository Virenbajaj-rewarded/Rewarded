import { EIndustry, EProgramStrategy, EOfferType } from '@/enums';
import { ILocation } from './ILocation';

export interface IStore {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNumber: string;
  businessCode?: string | null;
  location: ILocation;
  storeType: EIndustry;
  logoUrl: string;
  distance: number;
  businessAddress: string;
  tgUsername: string;
  whatsppUsername: string;
  status: string;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  activeRewardProgram: IActiveRewardProgram;
  lifetimeSavings: number;
  rewardPoints: number;
  spent: number;
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
