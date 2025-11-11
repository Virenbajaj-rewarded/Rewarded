import { EIndustry, EProgramStrategy, EOfferType } from '@/enums';

export interface Location {
  longitude: number;
  latitude: number;
}

export interface IStore {
  id: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessCode?: string | null;
  location: Location;
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
  activeRewardProgram: ActiveRewardProgram;
  lifetimeSavings: number;
  rewardPoints: number;
  spent: number;
}

export interface ActiveRewardProgram {
  id: string;
  name: string;
  strategy: EProgramStrategy;
  percentBack?: number;
  spendThreshold?: number;
  rewardPercent?: number;
  capPerTransaction?: number;
  offerType: EOfferType;
}
