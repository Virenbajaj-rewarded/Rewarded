import { ApiProperty } from '@nestjs/swagger';

export class MerchantOnboardingInfoDto {
  @ApiProperty({
    description: 'Merchant unique identifier (UUID)',
    example: '7e4a98c3-ccfa-41b8-b6d4-314799c6b7f1',
  })
  id: string;

  @ApiProperty({
    description: 'Merchant business email associated with onboarding token',
    example: 'info@coffeehouse.sk',
  })
  email: string;

  @ApiProperty({
    description: 'Merchant business name',
    example: 'Coffee House Bratislava',
  })
  businessName: string;
}
