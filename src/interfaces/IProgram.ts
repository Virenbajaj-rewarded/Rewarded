import { EOfferType, EProgramStrategy, EProgramStatus } from '@/enums';

export interface IProgram {
  id: string;
  name: string;
  strategy: EProgramStrategy;
  percentBack: number;
  spendThreshold: number;
  rewardPercent: number;
  maxDailyBudget: number;
  budget: number;
  fundedAmount: number;
  spentAmount: number;
  offerType: EOfferType;
  status: EProgramStatus;
  createdAt: Date;
  updatedAt: Date;
}
