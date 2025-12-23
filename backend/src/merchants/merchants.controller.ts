import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DecodedIdToken } from 'firebase-admin/auth';
import { CreateMerchantRequestDto } from './dto/create-merchant.request.dto';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import { ApiPaginatedResponse, ReqFirebase, Roles } from '../common/decorators';
import { MerchantsService } from './merchants.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '../users/types/user-role.enum';
import { CreateMerchantResponseDto } from './dto/create-merchant.response.dto';
import { UploadLogoResponseDto } from './dto/upload-logo.response.dto';
import { MerchantOnboardingInfoDto } from './dto/merchant-onboarding-info.dto';
import { GetMerchantByTokenParamsDto } from './dto/get-merchant-by-token.params.dto';
import { UpdateMerchantRequestDto } from './dto/update-merchant-profile.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { MerchantProfileResponseDto } from './dto/merchant-profile.response.dto';
import { MerchantStatsOverviewDto } from './dto/merchant-stats-overview.dto';
import { CustomerStatsDto } from './dto/customer-stats.dto';
import { PaginationQueryDto } from '../common/dto/pagination.query.dto';
import { Paginated } from '../common/dto/paginated';
import { MerchantTransactionItemDto } from './dto/merchant-transaction-item.dto';

@ApiTags('Merchants')
@Controller('merchants')
@ApiBearerAuth()
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get('me')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get current merchant profile',
    description:
      'Returns the full profile of the currently authenticated merchant, including business details, contact information, logo URL, and account status. The merchant is identified automatically from the Firebase token.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully retrieved merchant profile information for the authenticated merchant.',
    type: MerchantProfileResponseDto,
  })
  async me(
    @ReqFirebase() user: DecodedIdToken,
  ): Promise<MerchantProfileResponseDto> {
    return this.merchantsService.getMyProfile(user.uid);
  }

  @Post()
  @ApiOperation({
    summary: 'Submit a new merchant application (PENDING)',
    description:
      'Creates a new **merchant application** in `PENDING` status. ' +
      'This represents a request from a business to join the platform as a merchant. ' +
      'After submission, the application must be **reviewed and approved by an administrator** before the merchant account becomes active.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Merchant application created successfully and set to `PENDING` status. ' +
      'Awaiting admin approval.',
    type: CreateMerchantResponseDto,
  })
  async create(
    @Body() dto: CreateMerchantRequestDto,
  ): Promise<CreateMerchantResponseDto> {
    return this.merchantsService.createPendingApplication(dto);
  }

  @Get('onboarding/:token')
  @ApiOperation({
    summary: 'Get merchant info by onboarding token',
    description:
      'Retrieves merchant identifier and email associated with the onboarding token. ' +
      'Used by the frontend to finalize registration (e.g., setting password).',
  })
  @ApiResponse({
    status: 200,
    description: 'Valid token — returns merchant info.',
    type: MerchantOnboardingInfoDto,
  })
  async getMerchantByToken(
    @Param() params: GetMerchantByTokenParamsDto,
  ): Promise<MerchantOnboardingInfoDto> {
    return this.merchantsService.getMerchantByOnboardingToken(params.token);
  }

  @Get('me/customers')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get merchant customers with earned/spent stats' })
  @ApiPaginatedResponse(CustomerStatsDto, {
    status: 200,
    description: 'Paginated list of customers',
  })
  async getMyCustomers(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Query() pagination: PaginationQueryDto,
  ): Promise<Paginated<CustomerStatsDto>> {
    return this.merchantsService.getCustomers(firebaseUser.uid, pagination);
  }

  @Get('me/stats')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get aggregated stats for the current merchant',
    description: 'Returns high-level statistics for the authenticated merchant',
  })
  @ApiResponse({
    status: 200,
    description: 'Merchant stats successfully retrieved.',
    type: MerchantStatsOverviewDto,
  })
  async getStats(
    @ReqFirebase() user: DecodedIdToken,
  ): Promise<MerchantStatsOverviewDto> {
    return this.merchantsService.getStats(user.uid);
  }

  @Get('me/transactions')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get merchant transaction history',
    description:
      'Returns a paginated list of the transactions for the authenticated merchant. ',
  })
  @ApiPaginatedResponse(MerchantTransactionItemDto, {
    status: 200,
    description: 'Paginated list of the merchant`s transactions',
  })
  async getTransactions(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Query() query: PaginationQueryDto,
  ): Promise<Paginated<MerchantTransactionItemDto>> {
    return this.merchantsService.getTransactions(firebaseUser.uid, query);
  }

  @Post('upload-logo')
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg'
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only .png, .jpg and .jpeg formats are allowed'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload merchant logo',
    description:
      'Uploads or replaces the merchant logo image. ' +
      'Only `.png`, `.jpg`, and `.jpeg` formats are accepted, with a maximum size of 5 MB.',
  })
  @ApiResponse({
    status: 200,
    description: 'Merchant logo uploaded successfully.',
    type: UploadLogoResponseDto,
  })
  async uploadLogo(
    @ReqFirebase() user: DecodedIdToken,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadLogoResponseDto> {
    return this.merchantsService.uploadLogo(user.uid, file);
  }

  @Patch()
  @Roles(UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update merchant profile',
    description:
      'Allows the authenticated merchant to update business profile fields.',
  })
  @ApiResponse({
    status: 200,
    description: 'Merchant profile successfully updated.',
    type: SuccessResponseDto,
  })
  async updateMerchant(
    @ReqFirebase() fb: DecodedIdToken,
    @Body() dto: UpdateMerchantRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.merchantsService.updateMerchant(fb.uid, dto);
  }
}
