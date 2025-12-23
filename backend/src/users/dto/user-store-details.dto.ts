import { ApiProperty } from '@nestjs/swagger';
import { BaseMerchantDto } from '../../common/dto/base-merchant.dto';

export class UserStoreDetailsDto extends BaseMerchantDto {
  @ApiProperty({
    description: 'User’s current reward points balance in this store',
    example: 120,
  })
  rewardPoints: number;

  @ApiProperty({
    description: 'Total amount spent by the user in this store (USD)',
    example: 540.25,
  })
  spent: number;

  @ApiProperty({
    description: 'ID of merchant user (owner of the store)',
    example: 'd3f1c1a4-7c31-4ef3-b927-1234567890ab',
  })
  userId: string;
}
