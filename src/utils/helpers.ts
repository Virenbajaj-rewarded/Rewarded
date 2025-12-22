import { EProgramStrategy, EOfferType } from '@/enums';
import { IActiveRewardProgram, IProgram } from '@/interfaces';

export function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('⚠️ Invalid JSON:', str);
    return null;
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatCurrency(value: number) {
  return value != null ? `CAD ${value.toFixed(2)}` : 'N/A';
}

export const formatStrategyLabel = (program: IActiveRewardProgram | null): string => {
  if (!program) return 'Rewards currently inactive';
  const { strategy, offerType, percentBack, rewardPercent, spendThreshold } = program;
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

export const getRemainingBudget = (program: IProgram) => {
  const { strategy, fundedAmount, spentAmount, stopDistributionPoints } = program;
  if (!program) return 0;
  switch (strategy) {
    case EProgramStrategy.PERCENT_BACK:
      return fundedAmount - spentAmount;
    case EProgramStrategy.SPEND_TO_EARN:
      return fundedAmount - (spentAmount + stopDistributionPoints);
  }
};
