import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { OfferType, RewardStrategy } from '@prisma/client';

export class CreateRewardProgramDto {
  @ApiProperty({
    description: 'Program display name',
    example: 'Coffee Lovers Cashback',
  })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty({
    enum: RewardStrategy,
    description:
      'Reward strategy: PERCENT_BACK (instant cashback per transaction) or SPEND_TO_EARN (accumulate & reward)',
    example: RewardStrategy.PERCENT_BACK,
  })
  @IsEnum(RewardStrategy)
  strategy: RewardStrategy;

  @ApiProperty({
    enum: OfferType,
    description:
      'Offer type: POINTS_CASHBACK (percentage reward) or FIXED_AMOUNT_POINTS (fixed points per event)',
    example: OfferType.POINTS_CASHBACK,
  })
  @IsEnum(OfferType)
  offerType: OfferType;

  @ApiPropertyOptional({
    description: `
    For RewardStrategy.PERCENT_BACK:
    - If offerType = POINTS_CASHBACK → percentBack = % cashback per transaction (e.g. 5)
    - If offerType = FIXED_AMOUNT_POINTS → percentBack = fixed points per transaction (e.g. 50)
    For RewardStrategy.SPEND_TO_EARN:
    - Not used
    `,
    example: 5,
  })
  @ValidateIf((o) => o.strategy === RewardStrategy.PERCENT_BACK)
  @IsNumber()
  @IsPositive()
  percentBack?: number;

  @ApiPropertyOptional({
    description: `
    For RewardStrategy.SPEND_TO_EARN:
    - The spend amount threshold required to get reward (e.g. 100 USD)
    For RewardStrategy.PERCENT_BACK:
    - Not used
    `,
    example: 100,
  })
  @ValidateIf((o) => o.strategy === RewardStrategy.SPEND_TO_EARN)
  @IsNumber()
  @IsPositive()
  spendThreshold?: number;

  @ApiPropertyOptional({
    description: `
    For RewardStrategy.SPEND_TO_EARN:
    - If offerType = POINTS_CASHBACK → rewardPercent = % cashback after reaching threshold (e.g. 10)
    - If offerType = FIXED_AMOUNT_POINTS → rewardPercent = number of points granted after reaching threshold (e.g. 100)
    For RewardStrategy.PERCENT_BACK:
    - Not used
    `,
    example: 10,
  })
  @ValidateIf((o) => o.strategy === RewardStrategy.SPEND_TO_EARN)
  @IsNumber()
  @IsPositive()
  rewardPercent?: number;

  @ApiProperty({
    description: 'Max daily budget points per user',
    example: 25,
  })
  @IsNumber()
  @IsPositive()
  maxDailyBudget: number;

  @ApiProperty({
    description: 'Rewards program budget (required before activation)',
    example: 750,
  })
  @IsNumber()
  @IsPositive()
  budget: number;
}
