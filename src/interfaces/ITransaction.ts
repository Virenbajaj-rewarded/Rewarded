import { ETransactionType } from '@/enums';

export interface ITransaction {
  id: string;
  type: ETransactionType;
  points: number;
  createdAt: string;
  comment: string;
  rewardProgramId: string;
  rewardProgramName: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
}
