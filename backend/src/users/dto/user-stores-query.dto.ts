import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination.query.dto';
import { StoreType } from '@prisma/client';

export class UserStoresQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Filter stores by type (e.g. Bookstore, Restaurant, Supermarket, etc.)',
    enum: StoreType,
    example: StoreType.ACCOUNTING_BOOKKEEPING,
  })
  @IsOptional()
  @IsEnum(StoreType)
  storeType?: StoreType;
}
