import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReqFirebase, Roles } from '../common/decorators';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import { UserRole } from '../users/types/user-role.enum';
import { PointsService } from './points.service';
import { TransferPointsDto } from './dto/transfer-points.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/auth';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { IdParamDto } from '../common/dto/id.param.dto';

@ApiTags('Points')
@Controller('points')
@ApiBearerAuth()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('transfer')
  @Roles(UserRole.USER, UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Transfer points',
    description:
      'Transfers points between a user and a merchant. ' +
      'User → Merchant **or** Merchant → User are allowed. ' +
      'User → User **or** Merchant → Merchant are not allowed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transfer completed successfully.',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or insufficient balance.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — role combination not allowed.',
  })
  async transfer(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: TransferPointsDto,
  ): Promise<SuccessResponseDto> {
    return this.pointsService.transfer(user.uid, dto);
  }

  @Post('request')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create a CAD points payment request (merchant → user)',
  })
  async createPaymentRequest(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.pointsService.createPaymentRequest(user.uid, dto);
  }

  @Post('approve/:id')
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Approve payment request' })
  async approve(
    @ReqFirebase() user: DecodedIdToken,
    @Param() param: IdParamDto,
  ) {
    return this.pointsService.approve(user.uid, param.id);
  }

  @Post('decline/:id')
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Decline payment request' })
  async decline(
    @ReqFirebase() user: DecodedIdToken,
    @Param() param: IdParamDto,
  ) {
    return this.pointsService.decline(user.uid, param.id);
  }

  @Get('poll/user')
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'User polls for new payment requests (pending)' })
  async pollUserRequests(@ReqFirebase() user: DecodedIdToken) {
    return this.pointsService.pollUserRequests(user.uid);
  }

  @Get('poll/merchant')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Merchant polls for updates (approved/declined)' })
  async pollMerchant(@ReqFirebase() user: DecodedIdToken) {
    return this.pointsService.pollMerchant(user.uid);
  }

  @Post('user/seen/:id')
  @Roles(UserRole.USER)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mark payment request as seen by user' })
  async markSeenByUser(
    @ReqFirebase() user: DecodedIdToken,
    @Param() param: IdParamDto,
  ) {
    return this.pointsService.markSeenByUser(user.uid, param.id);
  }

  @Post('merchant/seen/:id')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mark payment request as seen by merchant' })
  async markSeenByMerchant(
    @ReqFirebase() user: DecodedIdToken,
    @Param() param: IdParamDto,
  ) {
    return this.pointsService.markSeenByMerchant(user.uid, param.id);
  }
}
