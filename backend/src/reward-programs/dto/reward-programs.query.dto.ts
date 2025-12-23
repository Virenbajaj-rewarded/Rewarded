import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RewardProgramStatus } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination.query.dto';

export class RewardProgramsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: RewardProgramStatus })
  @IsOptional()
  @IsEnum(RewardProgramStatus)
  status?: RewardProgramStatus;
}
