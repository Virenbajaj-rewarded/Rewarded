import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.query.dto';
import { MerchantStatus } from '@prisma/client';

export class AdminListMerchantsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: MerchantStatus,
    default: MerchantStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(MerchantStatus)
  status?: MerchantStatus = MerchantStatus.PENDING;
}
