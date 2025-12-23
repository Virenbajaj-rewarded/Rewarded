import { ApiProperty } from '@nestjs/swagger';
import { MerchantStatus } from '@prisma/client';

export class CreateMerchantResponseDto {
  @ApiProperty({
    description: 'Merchant unique identifier (UUID)',
    example: '7e4a98c3-ccfa-41b8-b6d4-314799c6b7f1',
  })
  id: string;

  @ApiProperty({
    description: 'Merchant business name',
    example: 'Coffee House Bratislava',
  })
  businessName: string;

  @ApiProperty({
    description: 'Merchant business email address',
    example: 'info@coffeehouse.sk',
  })
  businessEmail: string;

  @ApiProperty({
    description: 'Merchant contact phone number',
    example: '+421911234567',
  })
  businessPhoneNumber: string;

  @ApiProperty({
    description: 'Merchant business address',
    example: 'Hviezdoslavovo námestie 5, Bratislava, Slovakia',
  })
  businessAddress: string;

  @ApiProperty({
    description: 'Current merchant status',
    enum: MerchantStatus,
    example: MerchantStatus.PENDING,
  })
  status: MerchantStatus;

  @ApiProperty({
    description: 'Date and time when merchant was created',
    example: '2025-10-08T12:34:56.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when merchant was last updated',
    example: '2025-10-08T12:34:56.000Z',
  })
  updatedAt: Date;
}
