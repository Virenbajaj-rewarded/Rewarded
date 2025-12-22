import { EIndustry } from '@/enums';
import { IActiveRewardProgram } from '@/interfaces';

export interface IStoreListItem {
  id: string;
  name: string;
  logoUrl: string | undefined;
  rewardPoints: number;
  isLiked: boolean;
  businessCode: string;
  distance: number;
  storeType: EIndustry;
  activeRewardProgram: IActiveRewardProgram;
}

export interface IGetStoresResponse {
  items: IStoreListItem[];
  page: number;
  limit: number;
  total: number;
}
