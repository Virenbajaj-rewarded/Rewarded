import { ApiProperty } from '@nestjs/swagger';

export class UploadLogoResponseDto {
  @ApiProperty({
    description: 'Publicly accessible URL of the uploaded merchant logo',
    example:
      'https://s3.eu-central-1.amazonaws.com/rewardedapp/logos/merchant_7e4a98c3.png',
  })
  logoUrl: string;
}
