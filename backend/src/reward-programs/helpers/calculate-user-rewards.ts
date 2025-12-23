import { OfferType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export type UserRewardCalc = {
  consumerId: string;
  effective: Decimal;
};

export function calculateUserRewards(
  progresses: {
    consumerId: string;
    accumulatedAmount: Decimal;
  }[],
  program: {
    offerType: OfferType;
    rewardPercent: Decimal;
    spendThreshold: Decimal;
    maxDailyBudget: Decimal;
  },
  earnedTodayMap: Map<string, Decimal>,
): UserRewardCalc[] {
  const spendThreshold = program.spendThreshold;
  const rewardValue = program.rewardPercent;
  const maxDailyBudget = program.maxDailyBudget;

  return progresses.map((p) => {
    const spentCad = p.accumulatedAmount;

    if (spentCad.lte(0) || spendThreshold.lte(0)) {
      return {
        consumerId: p.consumerId,
        effective: new Decimal(0),
      };
    }

    let ideal = new Decimal(0);

    if (program.offerType === OfferType.POINTS_CASHBACK) {
      ideal = spentCad.mul(rewardValue).div(100);
    } else if (program.offerType === OfferType.FIXED_AMOUNT_POINTS) {
      const completion = Decimal.min(
        spentCad.div(spendThreshold),
        new Decimal(1),
      );
      ideal = completion.mul(rewardValue);
    }

    const earnedToday = earnedTodayMap.get(p.consumerId) ?? new Decimal(0);
    const remainingDaily = Decimal.max(
      new Decimal(0),
      maxDailyBudget.minus(earnedToday),
    );

    const effective = Decimal.max(
      new Decimal(0),
      Decimal.min(ideal, remainingDaily),
    );

    return {
      consumerId: p.consumerId,
      effective,
    };
  });
}
