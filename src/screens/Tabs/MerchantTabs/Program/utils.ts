import { EProgramStrategy, EProgramStatus, EOfferType } from '@/enums';
import { IActiveRewardProgram } from '@/interfaces/IStore';

export const getProgramStrategyBackground = (strategy: EProgramStrategy) => {
  switch (strategy) {
    case EProgramStrategy.PERCENT_BACK:
      return '#0C1A31';
    case EProgramStrategy.SPEND_TO_EARN:
      return '#120338';
  }
};

export const getProgramStrategyTextColor = (strategy: EProgramStrategy) => {
  switch (strategy) {
    case EProgramStrategy.PERCENT_BACK:
      return '#639CF8';
    case EProgramStrategy.SPEND_TO_EARN:
      return '#9254DE';
  }
};

export const getProgramStatusTextColor = (status: EProgramStatus) => {
  switch (status) {
    case EProgramStatus.ACTIVE:
      return '#73D13D';
    case EProgramStatus.DRAFT:
      return '#D48806';
    case EProgramStatus.STOPPED:
      return '#FF4D4F';
  }
};
export const getProgramStatusBackgroundColor = (status: EProgramStatus) => {
  switch (status) {
    case EProgramStatus.ACTIVE:
      return '#092B00';
    case EProgramStatus.DRAFT:
      return '#613400';
    case EProgramStatus.STOPPED:
      return '#5C0011';
  }
};

export const formatStrategyLabel = (program: IActiveRewardProgram | null): string => {
  if (!program) return '';
  const { strategy, offerType, percentBack, rewardPercent, spendThreshold } = program;
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
