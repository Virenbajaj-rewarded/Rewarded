import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRewardProgramDto } from './dto/create-reward-program.dto';
import { UpdateRewardProgramDto } from './dto/update-reward-program.dto';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import { ApiPaginatedResponse, ReqFirebase, Roles } from '../common/decorators';
import { DecodedIdToken } from 'firebase-admin/auth';
import { RewardProgramsService } from './reward-programs.service';
import { RewardProgramsQueryDto } from './dto/reward-programs.query.dto';
import { UserRole } from '../users/types/user-role.enum';
import { RewardProgramItemResponseDto } from './dto/reward-program-item.response.dto';
import { Paginated } from '../common/dto/paginated';
import { IdParamDto } from '../common/dto/id.param.dto';
import { TopUpRewardProgramDto } from './dto/top-up-reward-program.dto';
import { CreditUserDto } from './dto/credit-user.dto';
import { CreditUserResponseDto } from './dto/credit-user.response.dto';

@ApiTags('Reward Programs')
@Controller('reward-programs')
@ApiBearerAuth()
@Roles(UserRole.MERCHANT)
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class RewardProgramsController {
  constructor(private readonly rewardProgramsService: RewardProgramsService) {}

  @Get()
  @ApiOperation({
    summary: 'List reward programs for current merchant',
    description:
      'Returns a paginated list of all reward programs created by the merchant derived from the Firebase token. ' +
      'Each program includes configuration parameters, status, and time window.',
  })
  @ApiPaginatedResponse(RewardProgramItemResponseDto, {
    status: 200,
    description: 'Paginated list of reward programs',
  })
  async list(
    @ReqFirebase() user: DecodedIdToken,
    @Query() query: RewardProgramsQueryDto,
  ): Promise<Paginated<RewardProgramItemResponseDto>> {
    return this.rewardProgramsService.list(user.uid, query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a reward program (DRAFT by default)',
    description:
      'Creates a new reward program for the current merchant. ' +
      'Initial status is always DRAFT regardless of input. ',
  })
  @ApiResponse({
    status: 201,
    description: 'Reward program successfully created.',
    type: RewardProgramItemResponseDto,
  })
  async create(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: CreateRewardProgramDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.create(user.uid, dto);
  }

  @Post('credit-user/preview')
  @ApiOperation({ summary: 'Preview reward for credit user' })
  @ApiResponse({
    type: String,
    description: 'Reward preview after calculations',
  })
  async previewCreditUser(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: CreditUserDto,
  ): Promise<number> {
    return this.rewardProgramsService.previewCreditUser(user.uid, dto);
  }

  @Post('credit-user')
  @ApiOperation({ summary: 'Credit user according to active reward program' })
  @ApiResponse({
    description: 'User successfully credited.',
    type: CreditUserResponseDto,
  })
  async creditUser(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: CreditUserDto,
  ): Promise<CreditUserResponseDto> {
    return this.rewardProgramsService.creditUser(user.uid, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get reward program by ID',
    description:
      'Returns a single reward program that belongs to the current merchant.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward program fetched successfully.',
    type: RewardProgramItemResponseDto,
  })
  async getOne(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.getOne(user.uid, params.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a reward program',
    description:
      'Updates fields of a reward program belonging to the current merchant. ' +
      'Editin is allowed only for DRAFT programs. ',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward program successfully updated.',
    type: RewardProgramItemResponseDto,
  })
  async update(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
    @Body() dto: UpdateRewardProgramDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.update(user.uid, params.id, dto);
  }

  @Post(':id/withdraw')
  @ApiOperation({
    summary: 'Withdraw remaining funds',
    description:
      'Allows merchant to withdraw unused funds back to admin. Available only for STOPPED programs. Sets status to REFUNDED.',
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully refunded.',
    type: RewardProgramItemResponseDto,
  })
  async withdraw(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.withdraw(user.uid, params.id);
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate an approved reward program',
    description:
      'Program can move to ACTIVE only if status is APPROVED. Merchant must own the program.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward program activated.',
    type: RewardProgramItemResponseDto,
  })
  async activate(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.activate(user.uid, params.id);
  }

  @Post(':id/stop')
  @ApiOperation({
    summary: 'Stop an active reward program',
    description:
      'Program can move to STOPPED only if status is ACTIVE. Merchant must own the program.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward program stopped.',
    type: RewardProgramItemResponseDto,
  })
  async stop(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.stop(user.uid, params.id);
  }

  @Post(':id/renew')
  @ApiOperation({
    summary: 'Request renewal of a reward program',
    description:
      'Creates a new fund request for a completed program. Allowed only if spentAmount equals budget.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reward program renewed and moved to PENDING.',
    type: RewardProgramItemResponseDto,
  })
  async renew(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.renew(user.uid, params.id);
  }

  @Post(':id/fund')
  @ApiOperation({
    summary: 'Fund reward program',
    description:
      'Transfers amount from merchant wallet to program budget. Sets fundedAmount = budget.',
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully funded.',
    type: RewardProgramItemResponseDto,
  })
  async fund(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.fund(user.uid, params.id);
  }

  @Post(':id/top-up')
  @ApiOperation({
    summary: 'Top up a reward program budget',
    description:
      'Adds extra funds to a reward program. Allowed for ACTIVE, DRAFT, or STOPPED programs.',
  })
  @ApiResponse({
    status: 200,
    description: 'Program successfully topped up.',
    type: RewardProgramItemResponseDto,
  })
  async topUp(
    @ReqFirebase() user: DecodedIdToken,
    @Param() params: IdParamDto,
    @Body() dto: TopUpRewardProgramDto,
  ): Promise<RewardProgramItemResponseDto> {
    return this.rewardProgramsService.topUp(user.uid, params.id, dto.amount);
  }
}
