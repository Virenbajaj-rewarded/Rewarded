import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SuspendMerchantRequestDto {
  @ApiProperty({
    description: 'Reason for suspending merchant',
    example: 'Provided invalid documents',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
