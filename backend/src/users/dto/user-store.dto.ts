import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreType } from '@prisma/client';
import { ActiveRewardProgramDto } from '../../common/dto/base-merchant.dto';

export class UserStoreDto {
  @ApiProperty() id: string;

  @ApiProperty({ description: 'Display name of the business' })
  name: string;

  @ApiProperty({ description: 'Unique business code for public access' })
  businessCode: string;

  @ApiPropertyOptional({ description: 'Public logo URL of the merchant' })
  logoUrl: string | null;

  @ApiProperty({
    description: 'Type of store, e.g. Bookstore, Restaurant, Shop',
    enum: StoreType,
    example: StoreType.ACCOUNTING_BOOKKEEPING,
  })
  storeType: StoreType;

  @ApiPropertyOptional({ description: 'Distance from user in meters' })
  distance: number;

  @ApiPropertyOptional({
    description:
      'User’s reward points in this store for active rewards program',
  })
  rewardPoints: number | null;

  @ApiProperty()
  isLiked: boolean;

  @ApiPropertyOptional({ type: ActiveRewardProgramDto })
  activeRewardProgram: ActiveRewardProgramDto;
}
