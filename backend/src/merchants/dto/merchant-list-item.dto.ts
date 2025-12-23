import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MerchantStatus, StoreType } from '@prisma/client';

export class MerchantListItemDto {
  @ApiProperty({
    description: 'Unique merchant identifier (UUID)',
    example: '7e4a98c3-ccfa-41b8-b6d4-314799c6b7f1',
  })
  id: string;

  @ApiProperty({
    description: 'Merchant full name',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({ description: 'Unique business code for public access' })
  businessCode: string;

  @ApiProperty({
    description: 'Merchant business name (display name)',
    example: 'Coffee House Bratislava',
  })
  businessName: string;

  @ApiProperty({
    description: 'Merchant contact email address',
    example: 'info@coffeehouse.sk',
  })
  businessEmail: string;

  @ApiProperty({
    description: 'Merchant contact phone number',
    example: '+421911234567',
  })
  businessPhoneNumber: string;

  @ApiProperty({
    description: 'Merchant physical or legal address',
    example: 'Hviezdoslavovo námestie 5, Bratislava, Slovakia',
  })
  businessAddress: string;

  @ApiProperty({
    description:
      'Type of store or business category (e.g. CAFE, RESTAURANT, SHOP)',
    enum: StoreType,
    example: StoreType.ACCOUNTING_BOOKKEEPING,
  })
  storeType: StoreType;

  @ApiProperty({
    description: 'Current merchant application status',
    enum: MerchantStatus,
    example: MerchantStatus.PENDING,
  })
  status: MerchantStatus;

  @ApiProperty({
    description: 'Timestamp when the merchant record was created',
    example: '2025-10-08T12:34:56.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the merchant record was last updated',
    example: '2025-10-08T12:34:56.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Merchant suspend reason',
    example: 'Incorrect ID',
  })
  suspendReason: string;
}
