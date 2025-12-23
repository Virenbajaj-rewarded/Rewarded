import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class TransferPointsDto {
  @ApiProperty({
    description: 'Amount of points to transfer',
    example: 150,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  points: number;

  @ApiProperty({
    description: 'ID of the user who will receive the points',
    example: '8b4f3c7a-7f9c-4c1e-9c95-0a4a1c7412ec',
  })
  @IsUUID()
  toUserId: string;

  @ApiPropertyOptional({
    description: 'Amount of spent money',
    example: 100,
    minimum: 0.01,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({ description: 'Comment about the transaction' })
  @IsOptional()
  @IsString()
  comment?: string;
}
