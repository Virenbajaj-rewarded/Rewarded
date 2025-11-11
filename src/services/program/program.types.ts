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
  capPerTransaction: string | number;
  budget: string | number;
  percentBack?: string | number;
  spendThreshold?: string | number;
  rewardPercent?: string | number;
}

export interface IEditProgramPayload extends IProgram {
  status: EProgramStatus;
  id: string;
}
