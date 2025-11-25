import { IProgram } from '@/interfaces';
import { EProgramStrategy, EOfferType } from '@/enums';

export interface IGetProgramsResponse {
  items: IProgram[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreateProgramPayload {
  name: string;
  strategy: EProgramStrategy;
  offerType: EOfferType;
  maxDailyBudget: number | null;
  budget: number | null;
  percentBack?: number | null;
  spendThreshold?: number | null;
  rewardPercent?: number | null;
}

export interface IEditProgramPayload extends ICreateProgramPayload {
  id: string;
}
