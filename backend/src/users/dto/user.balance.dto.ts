import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserBalanceDto {
  @ApiProperty({ example: 120, description: 'User CAD points balance' })
  points: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Merchant frozen CAD points in reward programs',
  })
  budgetPoints?: number | null;
}
