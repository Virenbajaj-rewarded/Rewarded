import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import { UserProfileResponseDto } from './dto/user-profile.response.dto';
import { ApiPaginatedResponse, ReqFirebase, Roles } from '../common/decorators';
import { DecodedIdToken } from 'firebase-admin/auth';
import { PaginationQueryDto } from '../common/dto/pagination.query.dto';
import { Paginated } from '../common/dto/paginated';
import { UserStoreDto } from './dto/user-store.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { UserRole } from './types/user-role.enum';
import { UserTransactionItemDto } from './dto/user-transaction-item.dto';
import { UserProfileWithBalancesDto } from './dto/user-profile-with-balances.dto';
import { IdParamDto } from '../common/dto/id.param.dto';
import { UserStoresQueryDto } from './dto/user-stores-query.dto';
import { UserStoreDetailsDto } from './dto/user-store-details.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { DiscoverStoresQueryDto } from './dto/discover-stores.query.dto';
import { UserBalanceDto } from './dto/user.balance.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import { UserLastExpenseItemDto } from './dto/user-last-expense-item.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Roles(UserRole.USER, UserRole.MERCHANT)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns user data from DB based on Firebase UID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
    type: UserProfileResponseDto,
  })
  async getAllInfo(
    @ReqFirebase() firebaseUser: DecodedIdToken,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.getProfileByFirebaseId(firebaseUser.uid);
  }

  @Get('me/balance')
  @Roles(UserRole.USER, UserRole.MERCHANT)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      'Get points balance for current user (+ frozen CAD points in reward programs)',
    description:
      'Returns user points balance (+ frozen CAD points in reward programs). ' +
      'If balance does not exist, It is created automatically with zero value.',
  })
  @ApiResponse({
    status: 200,
    description:
      'User balance (for merchant also frozen CAD points in reward porgrams)',
    type: UserBalanceDto,
  })
  async getMyBalances(
    @ReqFirebase() firebaseUser: DecodedIdToken,
  ): Promise<UserBalanceDto> {
    return this.usersService.getUserBalanceByFirebaseId(firebaseUser.uid);
  }

  @Patch('me/location')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Update current user location (latitude/longitude)',
    description:
      'Updates the current user geographic coordinates based on provided latitude and longitude values. This data may be used for showing nearby merchants or offers.',
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
    description: 'Location updated successfully',
  })
  async updateMyLocation(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Body() dto: UpdateLocationDto,
  ): Promise<SuccessResponseDto> {
    return this.usersService.updateLocation(firebaseUser.uid, dto);
  }

  @Patch('me/profile')
  @Roles(UserRole.USER, UserRole.MERCHANT)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Update user profile (full name, email, phone)',
    description:
      'Allows user to update personal data such as full name, email, and phone number. ' +
      'Email and phone are validated for uniqueness.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: SuccessResponseDto,
  })
  async updateMyProfile(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<SuccessResponseDto> {
    return this.usersService.updateUserProfile(firebaseUser.uid, dto);
  }

  @Get('me/stores')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Get list of stores where user had earned points (My Stores)',
  })
  @ApiPaginatedResponse(UserStoreDto, {
    status: 200,
    description: 'Paginated list of user stores',
  })
  async getMyStores(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Query() query: UserStoresQueryDto,
  ): Promise<Paginated<UserStoreDto>> {
    return this.usersService.getMyStores(
      firebaseUser.uid,
      query.page,
      query.limit,
      query.storeType,
    );
  }

  @Post('me/stores/:id/like')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Like (add store to My Stores)' })
  @ApiResponse({ type: SuccessResponseDto })
  async likeStore(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<SuccessResponseDto> {
    return this.usersService.likeStore(firebaseUser.uid, params.id);
  }

  @Delete('me/stores/:id/like')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Unlike (remove store from My Stores)' })
  @ApiResponse({ type: SuccessResponseDto })
  async unlikeStore(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<SuccessResponseDto> {
    return this.usersService.unlikeStore(firebaseUser.uid, params.id);
  }

  @Get('me/stores/code/:businessCode')
  @Roles(UserRole.USER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Get detailed info for a specific store by business code',
    description:
      'Fetches detailed information about a store using its unique business code. Includes distance, lifetime savings, reward points, and active reward program.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed store info including distance, savings, and points.',
    type: UserStoreDetailsDto,
  })
  async getMyStoreDetailsByCode(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Param('businessCode') businessCode: string,
  ): Promise<UserStoreDetailsDto> {
    return this.usersService.getMyStoreByCode(firebaseUser.uid, businessCode);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MERCHANT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get user by ID with balance' })
  @ApiResponse({
    status: 200,
    description: 'User full info by ID with balances',
    type: UserProfileWithBalancesDto,
  })
  async getUserById(
    @Param() params: IdParamDto,
  ): Promise<UserProfileWithBalancesDto> {
    return this.usersService.findUserByIdWithBalance(params.id);
  }
}
