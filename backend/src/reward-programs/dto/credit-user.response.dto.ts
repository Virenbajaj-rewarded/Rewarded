import { SuccessResponseDto } from '../../common/dto/success-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreditUserResponseDto extends SuccessResponseDto {
  @ApiProperty({
    description: 'Active reward program ID',
    example: 'e73e7fbc-aab7-4eb3-98a4-24ed22c7cb48',
  })
  programId: string;

  constructor(rewardProgramId: string, success = true) {
    super(success);
    this.programId = rewardProgramId;
  }
}
