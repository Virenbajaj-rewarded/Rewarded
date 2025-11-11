import { EIndustry } from '@/enums';

export interface IStoreListItem {
  id: string;
  name: string;
  logoUrl: string | undefined;
  rewardPoints: number;
  businessCode: string;
  distance: number;
  storeType: EIndustry;
}

export interface IGetStoresResponse {
  items: IStoreListItem[];
  page: number;
  limit: number;
  total: number;
}

export interface ISavingsResponse {
  lifetimeSavingsUsd: number;
  rewardPointsBalance: number;
}
