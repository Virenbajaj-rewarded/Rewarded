import { EProgramStrategy, EOfferType } from '@/enums';
import { IActiveRewardProgram } from '@/interfaces';

export const formatStrategyLabel = (
  program: IActiveRewardProgram | null
): string => {
  if (!program) return '';
  const { strategy, offerType, percentBack, rewardPercent, spendThreshold } =
    program;
  if (strategy === EProgramStrategy.PERCENT_BACK) {
    if (offerType === EOfferType.POINTS_CASHBACK) {
      return `${percentBack || 0}% Instant Cashback `;
    } else {
      return `${percentBack || 0} Points Instant Cashback`;
    }
  } else if (strategy === EProgramStrategy.SPEND_TO_EARN) {
    if (offerType === EOfferType.POINTS_CASHBACK) {
      return `Spend $${spendThreshold || 0} get ${rewardPercent || 0}% Cashback`;
    } else {
      return `Spend $${spendThreshold || 0} get ${rewardPercent || 0} Points`;
    }
  }
  return '';
};
