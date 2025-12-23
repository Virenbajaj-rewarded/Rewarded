import { Prisma } from '@prisma/client';

export type RewardProgramWithProgresses = Prisma.RewardProgramGetPayload<{
  include: {
    consumerProgresses: true;
  };
}>;
