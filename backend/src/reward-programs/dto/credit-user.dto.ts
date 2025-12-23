import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreditUserDto {
  @ApiProperty({ description: 'Customer userId (UUID)' })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'Sum paid by user in CAD',
    example: 120.5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    description: 'Comment for the transaction',
    example: 'Comment for transaction',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
