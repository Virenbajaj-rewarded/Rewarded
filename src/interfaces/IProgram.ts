import { EOfferType, EProgramStrategy, EProgramStatus } from '@/enums';

export interface IProgram {
  id: string;
  name: string;
  strategy: EProgramStrategy;
  percentBack: string;
  spendThreshold: string;
  rewardPercent: string;
  capPerTransaction: string;
  budget: string;
  fundedAmount: string;
  spentAmount: string;
  offerType: EOfferType;
  status: EProgramStatus;
  createdAt: string;
  updatedAt: string;
}
