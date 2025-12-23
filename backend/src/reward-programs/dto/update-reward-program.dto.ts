import { PartialType } from '@nestjs/swagger';
import { CreateRewardProgramDto } from './create-reward-program.dto';

export class UpdateRewardProgramDto extends PartialType(
  CreateRewardProgramDto,
) {}
