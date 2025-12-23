import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferType, RewardProgramStatus, RewardStrategy } from '@prisma/client';

export class RewardProgramItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the reward program (UUID)',
    example: '7c5b25a4-fb34-4e52-8b8e-5c4af4d5e3b7',
  })
  id: string;

  @ApiProperty({
    description: 'Program name as displayed in the dashboard',
    example: 'Coffee Lovers Cashback',
  })
  name: string;

  @ApiProperty({
    enum: RewardStrategy,
    description: 'Reward calculation strategy: PERCENT_BACK or SPEND_TO_EARN',
    example: RewardStrategy.PERCENT_BACK,
  })
  strategy: RewardStrategy;

  @ApiPropertyOptional({
    description: 'Percent cashback value (only for PERCENT_BACK strategy).',
    example: '5.00',
  })
  percentBack?: number | null;

  @ApiPropertyOptional({
    description:
      'Minimum spend amount required to earn a reward (only for SPEND_TO_EARN strategy).',
    example: '50.00',
  })
  spendThreshold?: number | null;

  @ApiPropertyOptional({
    description:
      'Reward percent applied once the spend threshold is reached (SPEND_TO_EARN strategy).',
    example: '10.00',
  })
  rewardPercent?: number | null;

  @ApiProperty({
    description: 'Max daily budget points per user for this reward program.',
    example: '100.00',
  })
  maxDailyBudget: number;

  @ApiProperty({
    description:
      'Total program budget allocated for this reward program (frozen in merchant wallet).',
    example: '10000.00',
  })
  budget: number;

  @ApiProperty({
    description:
      'Total amount currently funded (deposited and frozen) by the merchant for this program.',
    example: '8000.00',
  })
  fundedAmount: number;

  @ApiProperty({
    description:
      'Total amount already spent from the budget on rewards (e.g., cashback or points distributed).',
    example: '2500.00',
  })
  spentAmount: number;

  @ApiProperty({
    enum: OfferType,
    description:
      'Type of offer: POINTS_CASHBACK (percent-based cashback) or FIXED_AMOUNT_POINTS (fixed points per transaction).',
    example: OfferType.POINTS_CASHBACK,
  })
  offerType: OfferType;

  @ApiProperty({
    enum: RewardProgramStatus,
    description:
      'Current lifecycle status of the reward program: DRAFT, ACTIVE, or STOPPED.',
    example: RewardProgramStatus.DRAFT,
  })
  status: RewardProgramStatus;

  @ApiProperty({
    description: 'Timestamp when the program was created in the system.',
    example: '2025-10-08T12:34:56.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the program was last updated.',
    example: '2025-10-09T10:21:45.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description:
      'How many points will actually be distributed to users if the program is stopped right now',
    example: 320,
  })
  stopDistributionPoints?: number;
}
