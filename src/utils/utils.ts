import { EProgramStrategy, EOfferType } from '@/enums';
import { IActiveRewardProgram, IProgram } from '@/interfaces';

export const formatStrategyLabel = (
  program: IActiveRewardProgram | null
): string => {
  if (!program) return 'Rewards currently inactive';
  const { strategy, offerType, percentBack, rewardPercent, spendThreshold } =
    program;
  if (strategy === EProgramStrategy.PERCENT_BACK) {
    if (offerType === EOfferType.POINTS_CASHBACK) {
      return `${percentBack || 0}% Instant Cashback`;
    } else {
      return `${percentBack || 0} Points Instant Cashback`;
    }
  } else if (strategy === EProgramStrategy.SPEND_TO_EARN) {
    if (offerType === EOfferType.POINTS_CASHBACK) {
      return `Spend CAD ${spendThreshold || 0} get ${rewardPercent || 0}% Cashback`;
    } else {
      return `Spend CAD ${spendThreshold || 0} get ${rewardPercent || 0} Points`;
    }
  }
  return 'Rewards currently inactive';
};

export const formatDistance = (distance: number) => {
  return distance ? `${distance} miles from you` : 'Address not available';
};

export const getRemainingBudget = (program: IProgram) => {
  const { strategy, fundedAmount, spentAmount, stopDistributionPoints } =
    program;
  if (!program) return 0;
  switch (strategy) {
    case EProgramStrategy.PERCENT_BACK:
      return fundedAmount - spentAmount;
    case EProgramStrategy.SPEND_TO_EARN:
      return fundedAmount - (spentAmount + stopDistributionPoints);
  }
};
