import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminListMerchantsQueryDto } from './dto/admin-list-merchants.query';
import { MerchantsService } from './merchants.service';
import { SuspendMerchantRequestDto } from './dto/suspend-merchant.request.dto';
import { ApiPaginatedResponse } from '../common/decorators';
import { Paginated } from '../common/dto/paginated';
import { MerchantListItemDto } from './dto/merchant-list-item.dto';
import { IdParamDto } from '../common/dto/id.param.dto';

@ApiTags('Admin/Merchants')
@Controller('admin/merchants')
/*@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(AdminJwtGuard, RolesGuard)*/ //TODO uncomment
export class MerchantsAdminController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get()
  @ApiOperation({
    summary: 'List merchants by status with pagination',
    description:
      'Returns a paginated list of merchants filtered by their status (PENDING, APPROVED, or SUSPENDED). Each merchant includes basic user info.',
  })
  @ApiPaginatedResponse(MerchantListItemDto, {
    status: 200,
    description: 'Successfully retrieved paginated list of merchants.',
  })
  async merchantsList(
    @Query() query: AdminListMerchantsQueryDto,
  ): Promise<Paginated<MerchantListItemDto>> {
    return this.merchantsService.list(query);
  }

  @Post(':id/approve')
  @ApiOperation({
    summary: 'Approve merchant (PENDING → APPROVED)',
    description:
      'Approves a pending merchant application. The merchant’s user role is changed to MERCHANT, and a notification email is sent automatically.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Merchant successfully approved and corresponding user role updated.',
    type: MerchantListItemDto,
  })
  async approveMerchant(
    @Param() { id }: IdParamDto,
  ): Promise<MerchantListItemDto> {
    return this.merchantsService.approve(id);
  }

  @Post(':id/suspend')
  @ApiOperation({
    summary: 'Suspend merchant (PENDING → SUSPENDED)',
    description:
      'Suspends a pending merchant application with a specified reason. A notification email is sent to the merchant.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Merchant successfully suspended. Status updated and email notification sent.',
    type: MerchantListItemDto,
  })
  async suspendMerchant(
    @Param() { id }: IdParamDto,
    @Body() dto: SuspendMerchantRequestDto,
  ): Promise<MerchantListItemDto> {
    return this.merchantsService.suspend(id, dto.reason);
  }
}
