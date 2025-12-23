import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMerchantByTokenParamsDto {
  @ApiProperty({
    description: 'Unique onboarding token assigned to the merchant',
    example: '8b1a9953c4611296a827abf8c47804d7',
  })
  @IsString()
  token: string;
}
