import { EIndustry } from '@/enums';
import { IActiveRewardProgram } from '@/interfaces/IStore';

export interface IStoreListItem {
  id: string;
  name: string;
  isLiked: boolean;
  logoUrl: string | undefined;
  rewardPoints: number;
  businessCode: string;
  distance: number;
  storeType: EIndustry;
  activeRewardProgram: IActiveRewardProgram | null;
}

export interface IGetStoresResponse {
  items: IStoreListItem[];
  page: number;
  limit: number;
  total: number;
}
