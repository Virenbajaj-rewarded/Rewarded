import { IProgram } from '@/interfaces';
import { EProgramStrategy, EOfferType, EProgramStatus } from '@/enums';

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
  maxDailyBudget: number;
  budget: number;
  percentBack?: number;
  spendThreshold?: number;
  rewardPercent?: number;
}

export interface IEditProgramPayload extends ICreateProgramPayload {
  id: string;
}
