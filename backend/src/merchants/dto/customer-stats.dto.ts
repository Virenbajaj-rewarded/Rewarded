import { ApiProperty } from '@nestjs/swagger';

export class CustomerStatsDto {
  @ApiProperty({
    description: 'Customer ID',
    example: '7e4a98c3-ccfa-41b8-b6d4-314799c6b7f1',
  })
  customerId: string;

  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  fullName: string;

  @ApiProperty({
    example: 1200,
    description: 'Points earned by merchant',
  })
  earned: number;

  @ApiProperty({
    example: 800,
    description: 'Points spent by merchant',
  })
  spent: number;
}
