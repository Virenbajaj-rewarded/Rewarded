import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentRequestDto {
  @ApiProperty({ description: 'Customer ID', example: 'uuid-string' })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'Amount of CAD points requested',
    example: 123.45,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    description: 'Optional comment',
    example: 'Haircut payment',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
