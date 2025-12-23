import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  RewardStrategy,
  OfferType,
  StoreType,
  MerchantStatus,
} from '@prisma/client';
import { LocationDto } from '../../merchants/dto/create-merchant.request.dto';

export class ActiveRewardProgramDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ enum: RewardStrategy }) strategy: RewardStrategy;
  @ApiProperty({ enum: OfferType }) offerType: OfferType;

  @ApiProperty() maxDailyBudget: number;
  @ApiPropertyOptional() percentBack: number | null;
  @ApiPropertyOptional() spendThreshold: number | null;
  @ApiPropertyOptional() rewardPercent: number | null;

  @ApiPropertyOptional({
    description: 'User progress for Spend-To-Earn programs',
    example: 42.75,
    nullable: true,
  })
  userProgress: number | null;
}

export class BaseMerchantDto {
  @ApiProperty() id: string;
  @ApiProperty() businessName: string;

  @ApiPropertyOptional() businessEmail?: string;
  @ApiPropertyOptional() businessCode?: string;
  @ApiPropertyOptional() businessPhoneNumber?: string;

  @ApiPropertyOptional() description?: string;

  @ApiProperty({
    description: 'Business location details',
    type: LocationDto,
  })
  location: LocationDto;

  @ApiPropertyOptional({
    description: 'Type of store',
    enum: StoreType,
  })
  storeType?: StoreType;

  @ApiPropertyOptional({ description: 'Public logo URL' })
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Distance between user and merchant in kilometers',
    example: 3.42,
    nullable: true,
  })
  distance?: number | null;

  @ApiPropertyOptional({
    description: 'Telegram username of the merchant',
    example: '@myshop',
  })
  tgUsername?: string | null;

  @ApiPropertyOptional({
    description: 'WhatsApp number or username of the merchant',
    example: '+123456789',
  })
  whatsppUsername?: string | null;

  @ApiProperty({
    enum: MerchantStatus,
    description: 'Current status of the merchant',
  })
  status: MerchantStatus;

  @ApiPropertyOptional({
    description:
      'Indicates whether this merchant is liked or interacted with by the user',
    example: true,
  })
  isLiked?: boolean;

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiPropertyOptional({ type: ActiveRewardProgramDto })
  activeRewardProgram?: ActiveRewardProgramDto | null;
}
