import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopUpRewardProgramDto {
  @ApiProperty({
    description: 'Amount to top up the reward program',
    example: 10,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;
}
