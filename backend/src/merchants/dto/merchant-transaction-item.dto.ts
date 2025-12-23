import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LedgerEventType } from '@prisma/client';

export class MerchantTransactionItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: LedgerEventType })
  type: LedgerEventType;

  @ApiProperty({
    description: 'Points delta (positive = earned, negative = redeemed)',
  })
  points: number;

  @ApiProperty()
  createdAt: string;

  @ApiPropertyOptional({ description: 'Optional comment added to transaction' })
  comment?: string | null;

  @ApiPropertyOptional({ description: 'Reward program ID, if linked' })
  rewardProgramId?: string | null;

  @ApiPropertyOptional({ description: 'Reward program name, if linked' })
  rewardProgramName?: string | null;

  @ApiPropertyOptional({ description: 'ID of the sender (user or merchant)' })
  fromId?: string | null;

  @ApiPropertyOptional({ description: 'Display name of sender' })
  fromName?: string | null;

  @ApiPropertyOptional({ description: 'ID of the receiver (user or merchant)' })
  toId?: string | null;

  @ApiPropertyOptional({ description: 'Display name of receiver' })
  toName?: string | null;
}
