import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import {
  LedgerEventType,
  OfferType,
  RewardProgram,
  RewardProgramStatus,
  RewardStrategy,
} from '@prisma/client';
import { CreateRewardProgramDto } from './dto/create-reward-program.dto';
import { UpdateRewardProgramDto } from './dto/update-reward-program.dto';
import { MerchantsService } from '../merchants/merchants.service';
import { RewardProgramsQueryDto } from './dto/reward-programs.query.dto';
import { toNumber } from './utils';
import { Paginated } from '../common/dto/paginated';
import { RewardProgramItemResponseDto } from './dto/reward-program-item.response.dto';
import { BalancesService } from '../balances/balances.service';
import { LedgerService } from '../ledger/ledger.service';
import {
  calculateUserRewards,
  UserRewardCalc,
} from './helpers/calculate-user-rewards';
import { getUtcDayRange } from './helpers/utc-date-range';
import { CreditUserDto } from './dto/credit-user.dto';
import { NotificationType } from '../notifications/types/notification-types';
import { UsersService } from '../users/users.service';
import { PushService } from '../notifications/push.service';
import { Decimal } from '@prisma/client/runtime/library';
import { RewardProgramWithProgresses } from './types';
import { CreditUserResponseDto } from './dto/credit-user.response.dto';

@Injectable()
export class RewardProgramsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly merchantsService: MerchantsService,
    private readonly balanceService: BalancesService,
    private readonly ledgerService: LedgerService,
    private readonly usersService: UsersService,
    private readonly pushService: PushService,
  ) {}

  async create(
    firebaseId: string,
    dto: CreateRewardProgramDto,
  ): Promise<RewardProgramItemResponseDto> {
    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    this.validateStrategyPayload({
      strategy: dto.strategy,
      percentBack: dto.percentBack ?? null,
      spendThreshold: dto.spendThreshold ?? null,
      rewardPercent: dto.rewardPercent ?? null,
    });

    const newProgram = await this.prisma.rewardProgram.create({
      data: {
        merchantId: merchant.id,
        name: dto.name,
        strategy: dto.strategy,
        percentBack: dto.percentBack ?? null,
        spendThreshold: dto.spendThreshold ?? null,
        rewardPercent: dto.rewardPercent ?? null,
        maxDailyBudget: dto.maxDailyBudget,
        budget: dto.budget,
        fundedAmount: 0,
        spentAmount: 0,
        offerType: dto.offerType,
        status: RewardProgramStatus.DRAFT,
      },
    });

    return this.mapProgramToResponse(newProgram);
  }

  async getOne(
    firebaseId: string,
    programId: string,
  ): Promise<
    RewardProgramItemResponseDto & { stopDistributionPoints: number }
  > {
    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
      include: {
        consumerProgresses: {
          where: { accumulatedAmount: { gt: 0 } },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot access this program');
    }

    const base = this.mapProgramToResponse(program);

    if (
      program.strategy !== RewardStrategy.SPEND_TO_EARN ||
      program.consumerProgresses.length === 0
    ) {
      return {
        ...base,
        stopDistributionPoints: 0,
      };
    }

    const funded = program.fundedAmount.toNumber();
    const spent = program.spentAmount.toNumber();
    const available = Math.max(0, funded - spent);

    if (available <= 0) {
      return {
        ...base,
        stopDistributionPoints: 0,
      };
    }

    const { totalToAward } = await this.calculatePossibleStopRewards(
      program,
      merchant.userId,
    );

    return {
      ...base,
      stopDistributionPoints: totalToAward.toNumber(),
    };
  }

  async list(
    firebaseId: string,
    opts?: RewardProgramsQueryDto,
  ): Promise<Paginated<RewardProgramItemResponseDto>> {
    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    const page = Math.max(1, opts?.page ?? 1);
    const limit = Math.min(100, Math.max(1, opts?.limit ?? 10));
    const offset = (page - 1) * limit;

    const where = {
      merchantId: merchant.id,
      ...(opts?.status ? { status: opts.status } : {}),
    };

    const [total, programs] = await this.prisma.$transaction([
      this.prisma.rewardProgram.count({ where }),
      this.prisma.rewardProgram.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          consumerProgresses: {
            where: { accumulatedAmount: { gt: 0 } },
            select: {
              consumerId: true,
              accumulatedAmount: true,
            },
          },
        },
      }),
    ]);

    if (!programs.length) {
      return new Paginated([], total, page, limit);
    }

    const consumerIds = Array.from(
      new Set(
        programs.flatMap((p) =>
          p.consumerProgresses.map((cp) => cp.consumerId),
        ),
      ),
    );

    const { start: startOfDay, end: endOfDay } = getUtcDayRange(new Date());

    const programDateConditions = programs.map((p) => ({
      programId: p.id,
      createdAt: {
        gte:
          p.strategyUpdatedAt > startOfDay ? p.strategyUpdatedAt : startOfDay,
        lte: endOfDay,
      },
    }));

    const earnedTodayRows = await this.prisma.ledgerEvent.groupBy({
      by: ['programId', 'toUserId'],
      where: {
        type: LedgerEventType.REDEEM,
        fromUserId: merchant.userId,
        toUserId: { in: consumerIds },
        OR: programDateConditions,
      },
      _sum: { points: true },
    });

    const earnedTodayByProgram = new Map<string, Map<string, Decimal>>();

    for (const row of earnedTodayRows) {
      if (!row.programId || !row.toUserId) continue;

      if (!earnedTodayByProgram.has(row.programId)) {
        earnedTodayByProgram.set(row.programId, new Map());
      }

      earnedTodayByProgram
        .get(row.programId)!
        .set(row.toUserId, new Decimal(row._sum.points ?? 0));
    }

    const items: RewardProgramItemResponseDto[] = programs.map((program) => {
      if (
        program.strategy !== RewardStrategy.SPEND_TO_EARN ||
        program.consumerProgresses.length === 0
      ) {
        return {
          ...this.mapProgramToResponse(program),
          stopDistributionPoints: 0,
        };
      }

      const earnedTodayMap =
        earnedTodayByProgram.get(program.id) ?? new Map<string, Decimal>();

      const rewards = calculateUserRewards(
        program.consumerProgresses.map((p) => ({
          consumerId: p.consumerId,
          accumulatedAmount: p.accumulatedAmount,
        })),
        {
          offerType: program.offerType,
          rewardPercent: program.rewardPercent,
          spendThreshold: program.spendThreshold,
          maxDailyBudget: program.maxDailyBudget,
        },
        earnedTodayMap,
      );

      const stopDistributionPoints = rewards.reduce(
        (sum, r) => sum.plus(r.effective),
        new Decimal(0),
      );

      return {
        ...this.mapProgramToResponse(program),
        stopDistributionPoints: stopDistributionPoints.toNumber(),
      };
    });

    return new Paginated(items, total, page, limit);
  }

  async creditUser(
    firebaseId: string,
    dto: CreditUserDto,
  ): Promise<CreditUserResponseDto> {
    const { customerId, amount, comment } = dto;

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    const customer = await this.usersService.findById(customerId);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const program = await this.prisma.rewardProgram.findFirst({
      where: {
        merchantId: merchant.id,
        status: RewardProgramStatus.ACTIVE,
      },
      include: {
        consumerProgresses: {
          where: { accumulatedAmount: { gt: 0 } },
        },
      },
    });

    if (!program) {
      throw new BadRequestException(
        'No active reward program. Activate program first.',
      );
    }

    const amountDecimal = new Decimal(amount);

    const dailyRemaining = await this.getUserDailyRemaining(
      customer.id,
      program,
      program.maxDailyBudget,
    );

    const availableBudget = program.fundedAmount.minus(program.spentAmount);

    if (availableBudget.lte(0)) {
      await this.stop(firebaseId, program.id, false);
      throw new ConflictException('Program budget exhausted');
    }

    if (program.strategy === RewardStrategy.PERCENT_BACK) {
      let rawPoints: Decimal;

      if (program.offerType === OfferType.POINTS_CASHBACK) {
        rawPoints = amountDecimal.mul(program.percentBack).div(100);
      } else {
        rawPoints = program.percentBack;
      }

      const candidatePoints = Decimal.min(rawPoints, dailyRemaining);

      if (availableBudget.lt(candidatePoints)) {
        await this.stop(firebaseId, program.id, false);
        throw new ConflictException('Insufficient budget. Program stopped');
      }

      await this.prisma.$transaction(async (tx) => {
        await this.ledgerService.createLedgerRecord(
          {
            type: LedgerEventType.REDEEM,
            fromUserId: merchant.userId,
            toUserId: customer.id,
            programId: program.id,
            points: candidatePoints,
            amount: amountDecimal,
            comment: comment ?? 'Instant cashback reward',
          },
          tx,
        );

        if (candidatePoints.gt(0)) {
          await this.balanceService.addPoints(customer.id, candidatePoints, tx);

          await tx.rewardProgram.update({
            where: { id: program.id },
            data: {
              spentAmount: { increment: candidatePoints },
            },
          });
        }
      });

      await this.pushService.sendToUser(customer.id, {
        title: 'Reward credited',
        body: `You received ${candidatePoints.toString()} points`,
        data: { type: NotificationType.REWARD_CREDITED },
      });

      return new CreditUserResponseDto(program.id, true);
    }

    if (program.strategy === RewardStrategy.SPEND_TO_EARN) {
      const existingProgress =
        program.consumerProgresses.find((p) => p.consumerId === customer.id)
          ?.accumulatedAmount ?? new Decimal(0);

      const totalAccumulated = existingProgress.plus(amountDecimal);
      const threshold = program.spendThreshold;

      const completedCycles = totalAccumulated.div(threshold).floor();

      let rewardPerCycle: Decimal;
      if (program.offerType === OfferType.POINTS_CASHBACK) {
        rewardPerCycle = threshold.mul(program.rewardPercent).div(100);
      } else {
        rewardPerCycle = program.rewardPercent;
      }

      const rawReward = completedCycles.gt(0)
        ? rewardPerCycle.mul(completedCycles)
        : new Decimal(0);

      const candidateReward = Decimal.min(rawReward, dailyRemaining);

      const remainder = totalAccumulated.minus(completedCycles.mul(threshold));

      const virtualProgresses = [
        ...program.consumerProgresses.filter(
          (p) => p.consumerId !== customer.id,
        ),
        {
          merchantId: '',
          programId: program.id,
          consumerId: customer.id,
          accumulatedAmount: remainder,
          updatedAt: new Date(),
        },
      ];

      const virtualProgram = {
        ...program,
        consumerProgresses: virtualProgresses,
      };

      const { totalToAward: possibleStopRewards } =
        await this.calculatePossibleStopRewards(
          virtualProgram,
          merchant.userId,
        );

      const totalAfterIssue = program.spentAmount
        .plus(possibleStopRewards)
        .plus(candidateReward);

      if (totalAfterIssue.gt(program.fundedAmount)) {
        await this.stop(firebaseId, program.id, false);
        throw new ConflictException('Insufficient budget. Program stopped');
      }

      await this.prisma.$transaction(async (tx) => {
        await this.ledgerService.createLedgerRecord(
          {
            type: LedgerEventType.REDEEM,
            fromUserId: merchant.userId,
            toUserId: customer.id,
            programId: program.id,
            amount: amountDecimal,
            points: candidateReward,
            comment: comment ?? 'Spend-to-earn reward',
          },
          tx,
        );

        if (candidateReward.gt(0)) {
          await this.balanceService.addPoints(customer.id, candidateReward, tx);

          await tx.rewardProgram.update({
            where: { id: program.id },
            data: {
              spentAmount: { increment: candidateReward },
            },
          });
        }

        await tx.customerProgress.upsert({
          where: {
            merchantId_consumerId_programId: {
              merchantId: merchant.id,
              consumerId: customer.id,
              programId: program.id,
            },
          },
          update: { accumulatedAmount: remainder },
          create: {
            merchantId: merchant.id,
            consumerId: customer.id,
            programId: program.id,
            accumulatedAmount: remainder,
          },
        });
      });

      if (candidateReward.gt(0)) {
        await this.pushService.sendToUser(customer.id, {
          title: 'Reward credited',
          body: `You received ${candidateReward.toString()} points`,
          data: { type: NotificationType.REWARD_CREDITED },
        });
      }

      return new CreditUserResponseDto(program.id, true);
    }

    throw new BadRequestException('Unsupported reward strategy');
  }

  async previewCreditUser(
    firebaseUid: string,
    dto: CreditUserDto,
  ): Promise<number> {
    const { customerId, amount } = dto;

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseUid);

    const customer = await this.usersService.findById(customerId);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const program = await this.prisma.rewardProgram.findFirst({
      where: {
        merchantId: merchant.id,
        status: RewardProgramStatus.ACTIVE,
      },
      include: {
        consumerProgresses: {
          where: { accumulatedAmount: { gt: 0 } },
        },
      },
    });

    if (!program) {
      throw new BadRequestException(
        'No active reward program. Activate program first',
      );
    }

    const amountDecimal = new Decimal(amount);

    const dailyRemaining = await this.getUserDailyRemaining(
      customer.id,
      program,
      program.maxDailyBudget,
    );

    if (dailyRemaining.lte(0)) {
      return 0;
    }

    const availableBudget = program.fundedAmount.minus(program.spentAmount);
    if (availableBudget.lte(0)) {
      throw new ConflictException(
        `Insufficient budget. Left ${availableBudget.toFixed(2)} CAD points`,
      );
    }

    if (program.strategy === RewardStrategy.PERCENT_BACK) {
      let rawPoints: Decimal;

      if (program.offerType === OfferType.POINTS_CASHBACK) {
        rawPoints = amountDecimal.mul(program.percentBack).div(100);
      } else {
        rawPoints = program.percentBack;
      }

      const candidate = Decimal.min(rawPoints, dailyRemaining);

      if (candidate.lte(0)) {
        return 0;
      }

      if (availableBudget.lt(candidate)) {
        throw new ConflictException(
          `Insufficient budget. Left ${availableBudget.toFixed(2)} CAD points`,
        );
      }

      return candidate.toNumber();
    }

    if (program.strategy === RewardStrategy.SPEND_TO_EARN) {
      const userProgress =
        program.consumerProgresses.find((p) => p.consumerId === customer.id)
          ?.accumulatedAmount ?? new Decimal(0);

      const threshold = program.spendThreshold;
      const totalAccumulated = userProgress.plus(amountDecimal);

      if (threshold.lte(0)) {
        return 0;
      }

      const completedCycles = totalAccumulated.div(threshold).floor();

      let rewardPerCycle: Decimal;

      if (program.offerType === OfferType.POINTS_CASHBACK) {
        rewardPerCycle = threshold.mul(program.rewardPercent).div(100);
      } else {
        rewardPerCycle = program.rewardPercent;
      }

      const rawReward = rewardPerCycle.mul(completedCycles);

      const candidate = Decimal.min(rawReward, dailyRemaining);

      const remainder = totalAccumulated.minus(completedCycles.mul(threshold));

      const virtualProgresses = [
        ...program.consumerProgresses.filter(
          (p) => p.consumerId !== customer.id,
        ),
        {
          merchantId: '',
          programId: program.id,
          consumerId: customer.id,
          accumulatedAmount: remainder,
          updatedAt: new Date(),
        },
      ];

      const virtualProgram = {
        ...program,
        consumerProgresses: virtualProgresses,
      };

      const { totalToAward: possibleStopRewards } =
        await this.calculatePossibleStopRewards(
          virtualProgram,
          merchant.userId,
        );

      const totalAfterIssue = program.spentAmount
        .plus(candidate)
        .plus(possibleStopRewards);

      if (totalAfterIssue.gt(program.fundedAmount)) {
        throw new ConflictException(
          `Insufficient budget. The budget requires ${Decimal.abs(program.fundedAmount.sub(totalAfterIssue)).toFixed(2)} CAD points.`,
        );
      }

      return candidate.toNumber();
    }

    return 0;
  }

  async update(
    firebaseId: string,
    programId: string,
    dto: UpdateRewardProgramDto,
  ): Promise<RewardProgramItemResponseDto> {
    const existing = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
      select: {
        id: true,
        merchantId: true,
        status: true,
        name: true,
        strategy: true,
        percentBack: true,
        spendThreshold: true,
        rewardPercent: true,
        maxDailyBudget: true,
        budget: true,
        fundedAmount: true,
      },
    });

    if (!existing) throw new NotFoundException('Program not found');

    const isEditable =
      existing.status === RewardProgramStatus.DRAFT ||
      existing.status === RewardProgramStatus.STOPPED;
    if (!isEditable) {
      throw new BadRequestException(
        'Only Draft or Stopped program can be updated',
      );
    }

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);
    if (existing.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot edit this program');
    }

    const strategy: RewardStrategy = dto.strategy ?? existing.strategy;
    const strategyChanged = dto.strategy && dto.strategy !== existing.strategy;

    const percentBack =
      strategy === RewardStrategy.PERCENT_BACK
        ? (toNumber(dto.percentBack) ?? toNumber(existing.percentBack))
        : null;

    const spendThreshold =
      strategy === RewardStrategy.SPEND_TO_EARN
        ? (toNumber(dto.spendThreshold) ?? toNumber(existing.spendThreshold))
        : null;

    const rewardPercent =
      strategy === RewardStrategy.SPEND_TO_EARN
        ? (toNumber(dto.rewardPercent) ?? toNumber(existing.rewardPercent))
        : null;

    this.validateStrategyPayload({
      strategy,
      percentBack,
      spendThreshold,
      rewardPercent,
    });

    const newData: UpdateRewardProgramDto = {
      name: dto.name ?? existing.name,
      strategy,
      offerType: dto.offerType,
      percentBack,
      spendThreshold,
      rewardPercent,
      maxDailyBudget:
        toNumber(dto.maxDailyBudget) ?? toNumber(existing.maxDailyBudget),
      budget: toNumber(dto.budget) ?? toNumber(existing.budget),
      ...(strategyChanged && { strategyUpdatedAt: new Date() }),
    };

    const updatedRewardProgram = await this.prisma.rewardProgram.update({
      where: { id: programId },
      data: newData,
    });

    return this.mapProgramToResponse(updatedRewardProgram);
  }

  async activate(
    firebaseId: string,
    programId: string,
  ): Promise<RewardProgramItemResponseDto> {
    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
      select: {
        id: true,
        merchantId: true,
        status: true,
        fundedAmount: true,
        budget: true,
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot activate this program');
    }

    if (program.status !== RewardProgramStatus.DRAFT) {
      throw new BadRequestException('Only Draft programs can be activated');
    }

    const existingActive = await this.getActiveProgramByMerchantId(
      merchant.id,
      programId,
    );

    if (existingActive) {
      throw new BadRequestException(
        'You already have an active reward program. Stop it before activating another one.',
      );
    }

    if (
      !program.fundedAmount ||
      !program.budget ||
      !program.fundedAmount.eq(program.budget)
    ) {
      throw new BadRequestException(
        'Cannot activate program: budget is not fully funded',
      );
    }

    const updated = await this.prisma.rewardProgram.update({
      where: { id: programId },
      data: {
        status: RewardProgramStatus.ACTIVE,
        spentAmount: 0,
      },
    });

    return this.mapProgramToResponse(updated);
  }

  async stop(
    firebaseId: string,
    programId: string,
    isManual: boolean = true,
  ): Promise<RewardProgramItemResponseDto> {
    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
      include: {
        consumerProgresses: {
          where: { accumulatedAmount: { gt: 0 } },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot stop this program');
    }

    if (program.status !== RewardProgramStatus.ACTIVE) {
      throw new BadRequestException('Only ACTIVE programs can be stopped');
    }

    if (program.strategy === RewardStrategy.PERCENT_BACK) {
      const updated = await this.prisma.rewardProgram.update({
        where: { id: programId },
        data: {
          status: RewardProgramStatus.STOPPED,
          ...(isManual && { strategyUpdatedAt: new Date() }),
        },
      });

      return this.mapProgramToResponse(updated);
    }

    if (!program.consumerProgresses.length) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.customerProgress.updateMany({
          where: { programId },
          data: { accumulatedAmount: 0 },
        });

        return tx.rewardProgram.update({
          where: { id: programId },
          data: {
            status: RewardProgramStatus.STOPPED,
            ...(isManual && { strategyUpdatedAt: new Date() }),
          },
        });
      });

      return this.mapProgramToResponse(updated);
    }

    const { totalToAward, rewards } = await this.calculatePossibleStopRewards(
      program,
      merchant.userId,
    );

    if (totalToAward.lte(0)) {
      const updated = await this.prisma.$transaction(async (tx) => {
        await tx.customerProgress.updateMany({
          where: { programId },
          data: { accumulatedAmount: 0 },
        });

        return tx.rewardProgram.update({
          where: { id: programId },
          data: {
            status: RewardProgramStatus.STOPPED,
            ...(isManual && { strategyUpdatedAt: new Date() }),
          },
        });
      });

      return this.mapProgramToResponse(updated);
    }

    const updatedProgram = await this.prisma.$transaction(async (tx) => {
      let totalAwarded = new Decimal(0);

      for (const r of rewards) {
        if (r.effective.lte(0)) continue;

        const points = new Decimal(r.effective);

        await this.ledgerService.createLedgerRecord(
          {
            type: LedgerEventType.REDEEM,
            fromUserId: merchant.userId,
            toUserId: r.consumerId,
            programId: program.id,
            amount: new Decimal(0),
            points,
            comment: `Spend-to-earn ${program.name} program stopped`,
          },
          tx,
        );

        await this.balanceService.addPoints(r.consumerId, points, tx);

        totalAwarded = totalAwarded.plus(points);

        await tx.customerProgress.update({
          where: {
            merchantId_consumerId_programId: {
              merchantId: program.merchantId,
              consumerId: r.consumerId,
              programId: program.id,
            },
          },
          data: { accumulatedAmount: 0 },
        });
      }

      return tx.rewardProgram.update({
        where: { id: programId },
        data: {
          status: RewardProgramStatus.STOPPED,
          spentAmount: program.spentAmount.plus(totalAwarded),
          ...(isManual && { strategyUpdatedAt: new Date() }),
        },
      });
    });

    return this.mapProgramToResponse(updatedProgram);
  }

  async withdraw(
    firebaseId: string,
    programId: string,
  ): Promise<RewardProgramItemResponseDto> {
    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
    });

    if (!program) throw new NotFoundException('Program not found');

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException(
        'You cannot withdraw funds from this program',
      );
    }

    if (program.status !== RewardProgramStatus.STOPPED) {
      throw new BadRequestException(
        'Withdraw is allowed only for STOPPED programs',
      );
    }

    const funded = program.fundedAmount;
    const spent = program.spentAmount;
    const available = Decimal.max(0, funded.sub(spent));

    if (available.lte(0)) {
      throw new BadRequestException('No funds available to withdraw');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await this.ledgerService.createLedgerRecord(
        {
          toUserId: merchant.userId,
          programId: program.id,
          type: LedgerEventType.REFUND,
          points: available,
          amount: new Decimal(0),
          comment: `Withdraw unused ${program.name} program funds`,
        },
        tx,
      );

      await this.balanceService.addPoints(merchant.userId, available, tx);

      return tx.rewardProgram.update({
        where: { id: programId },
        data: {
          spentAmount: funded,
        },
      });
    });

    return this.mapProgramToResponse(updated);
  }

  async renew(
    firebaseId: string,
    programId: string,
  ): Promise<RewardProgramItemResponseDto> {
    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
      select: {
        id: true,
        merchantId: true,
        status: true,
        budget: true,
        fundedAmount: true,
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot renew this program');
    }

    if (program.status !== RewardProgramStatus.STOPPED) {
      throw new BadRequestException('Only STOPPED programs can be renewed');
    }

    const existingActive = await this.getActiveProgramByMerchantId(
      merchant.id,
      programId,
    );

    if (existingActive) {
      throw new BadRequestException(
        'You already have an active reward program. Stop it before activating another one.',
      );
    }

    if (!program.budget.eq(program.fundedAmount)) {
      throw new BadRequestException(
        'You must fully fund the program before renewing.',
      );
    }

    const updated = await this.prisma.rewardProgram.update({
      where: { id: programId },
      data: {
        status: RewardProgramStatus.ACTIVE,
        spentAmount: 0,
      },
    });

    return this.mapProgramToResponse(updated);
  }

  async fund(
    firebaseId: string,
    programId: string,
  ): Promise<RewardProgramItemResponseDto> {
    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
    });

    if (!program) throw new NotFoundException('Program not found');

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot fund this program');
    }

    if (
      program.status !== RewardProgramStatus.STOPPED &&
      program.status !== RewardProgramStatus.DRAFT
    ) {
      throw new BadRequestException(
        'Only STOPPED or DRAFT programs can be funded.',
      );
    }

    const newBudget = program.budget;
    const funded = program.fundedAmount;

    if (newBudget.gt(funded)) {
      const amountToAdd = newBudget.sub(funded);

      const merchantBalance = await this.balanceService.getBalance(
        merchant.userId,
      );

      if (merchantBalance.lt(amountToAdd)) {
        throw new BadRequestException(
          'Insufficient balance to fund the program.',
        );
      }

      const updated = await this.prisma.$transaction(async (tx) => {
        await this.ledgerService.createLedgerRecord(
          {
            amount: amountToAdd,
            fromUserId: merchant.userId,
            programId: program.id,
            type: LedgerEventType.PROGRAM_REPLENISHMENT,
            points: new Decimal(0),
            comment: funded.eq(0)
              ? `${program.name} program budget created`
              : `${program.name} program budget increased — additional funding`,
          },
          tx,
        );

        await this.balanceService.subtractPoints(
          merchant.userId,
          amountToAdd,
          tx,
        );

        return tx.rewardProgram.update({
          where: { id: programId },
          data: { fundedAmount: newBudget },
        });
      });

      return this.mapProgramToResponse(updated);
    }

    if (newBudget.lt(funded)) {
      const amountToRefund = funded.sub(newBudget);

      const updated = await this.prisma.$transaction(async (tx) => {
        await this.ledgerService.createLedgerRecord(
          {
            amount: new Decimal(0),
            toUserId: merchant.userId,
            programId: program.id,
            type: LedgerEventType.REFUND,
            points: amountToRefund,
            comment: `${program.name} program budget decreased — refund of unused funds`,
          },
          tx,
        );

        await this.balanceService.addPoints(
          merchant.userId,
          amountToRefund,
          tx,
        );

        return tx.rewardProgram.update({
          where: { id: programId },
          data: { fundedAmount: newBudget },
        });
      });

      return this.mapProgramToResponse(updated);
    }

    return this.mapProgramToResponse(program);
  }

  async topUp(
    firebaseId: string,
    programId: string,
    amount: number,
  ): Promise<RewardProgramItemResponseDto> {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Top-up amount must be greater than zero.');
    }

    const program = await this.prisma.rewardProgram.findUnique({
      where: { id: programId },
    });

    if (!program) throw new NotFoundException('Program not found');

    const merchant =
      await this.merchantsService.getMerchantByFirebaseId(firebaseId);

    if (program.merchantId !== merchant.id) {
      throw new ForbiddenException('You cannot top up this program');
    }

    if (
      ![
        RewardProgramStatus.DRAFT,
        RewardProgramStatus.ACTIVE,
        RewardProgramStatus.STOPPED,
      ].includes(program.status)
    ) {
      throw new BadRequestException(
        'Only DRAFT, ACTIVE, or STOPPED programs can be topped up.',
      );
    }

    const merchantBalance = await this.balanceService.getBalance(
      merchant.userId,
    );

    if (merchantBalance.lt(amount)) {
      throw new BadRequestException(
        'Insufficient balance to top up the program.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const decimalAmount = new Decimal(amount);

      await this.ledgerService.createLedgerRecord(
        {
          amount: decimalAmount,
          fromUserId: merchant.userId,
          programId: program.id,
          type: LedgerEventType.PROGRAM_REPLENISHMENT,
          points: new Decimal(0),
          comment: `${program.name} program top-up`,
        },
        tx,
      );

      await this.balanceService.subtractPoints(
        merchant.userId,
        decimalAmount,
        tx,
      );

      const funded = program.fundedAmount;
      const budget = program.budget;

      const fundedNew = funded.plus(amount);

      const newFunded = fundedNew;
      let newBudget = budget;

      if (fundedNew.gt(budget)) {
        newBudget = fundedNew;
      }

      return tx.rewardProgram.update({
        where: { id: programId },
        data: {
          fundedAmount: newFunded,
          budget: newBudget,
        },
      });
    });

    return this.mapProgramToResponse(updated);
  }

  private async getActiveProgramByMerchantId(
    merchantId: string,
    excludedId?: string,
  ) {
    return this.prisma.rewardProgram.findFirst({
      where: {
        merchantId,
        status: RewardProgramStatus.ACTIVE,
        ...(excludedId ? { id: { not: excludedId } } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  private async getUserDailyRemaining(
    userId: string,
    program: RewardProgram,
    maxDailyBudget: Decimal,
  ): Promise<Decimal> {
    const { start, end } = getUtcDayRange();

    const fromDate =
      program.strategyUpdatedAt > start ? program.strategyUpdatedAt : start;

    const todayEarned = await this.prisma.ledgerEvent.aggregate({
      where: {
        type: LedgerEventType.REDEEM,
        toUserId: userId,
        programId: program.id,
        createdAt: {
          gte: fromDate,
          lte: end,
        },
      },
      _sum: { points: true },
    });

    const earnedToday = new Decimal(todayEarned._sum.points ?? 0);

    return Decimal.max(new Decimal(0), maxDailyBudget.minus(earnedToday));
  }

  private async calculatePossibleStopRewards(
    program: RewardProgramWithProgresses,
    merchantUserId: string,
  ): Promise<{ rewards: UserRewardCalc[]; totalToAward: Decimal }> {
    if (program.strategy !== RewardStrategy.SPEND_TO_EARN) {
      return { rewards: [], totalToAward: new Decimal(0) };
    }

    if (!program.consumerProgresses?.length) {
      return { rewards: [], totalToAward: new Decimal(0) };
    }

    const { start: todayStart, end: todayEnd } = getUtcDayRange();

    const fromDate =
      program.strategyUpdatedAt > todayStart
        ? program.strategyUpdatedAt
        : todayStart;

    const earnedTodayRows = await this.prisma.ledgerEvent.groupBy({
      by: ['toUserId'],
      where: {
        type: LedgerEventType.REDEEM,
        programId: program.id,
        fromUserId: merchantUserId,
        createdAt: {
          gte: fromDate,
          lte: todayEnd,
        },
      },
      _sum: { points: true },
    });

    const earnedTodayMap = new Map<string, Decimal>();
    for (const r of earnedTodayRows) {
      earnedTodayMap.set(r.toUserId, new Decimal(r._sum.points ?? 0));
    }

    const rewards = calculateUserRewards(
      program.consumerProgresses.map((p) => ({
        consumerId: p.consumerId,
        accumulatedAmount: p.accumulatedAmount,
      })),
      {
        offerType: program.offerType,
        rewardPercent: program.rewardPercent,
        spendThreshold: program.spendThreshold,
        maxDailyBudget: program.maxDailyBudget,
      },
      earnedTodayMap,
    );

    const totalToAward = rewards.reduce(
      (sum, r) => sum.plus(r.effective),
      new Decimal(0),
    );

    return { rewards, totalToAward };
  }

  private validateStrategyPayload(dto: {
    strategy: RewardStrategy;
    percentBack?: number | null;
    spendThreshold?: number | null;
    rewardPercent?: number | null;
  }) {
    const { strategy, percentBack, spendThreshold, rewardPercent } = dto;

    if (strategy === RewardStrategy.PERCENT_BACK) {
      if (percentBack == null) {
        throw new BadRequestException(
          'percentBack is required for PERCENT_BACK strategy',
        );
      }
      if (spendThreshold != null || rewardPercent != null) {
        throw new BadRequestException(
          'spendThreshold/rewardPercent are not allowed for PERCENT_BACK strategy',
        );
      }
    }

    if (strategy === RewardStrategy.SPEND_TO_EARN) {
      if (spendThreshold == null || rewardPercent == null) {
        throw new BadRequestException(
          'spendThreshold and rewardPercent are required for SPEND_TO_EARN strategy',
        );
      }
      if (percentBack != null) {
        throw new BadRequestException(
          'percentBack is not allowed for SPEND_TO_EARN strategy',
        );
      }
    }
  }

  private mapProgramToResponse(
    program: RewardProgram,
  ): RewardProgramItemResponseDto {
    return {
      id: program.id,
      name: program.name,
      strategy: program.strategy,
      percentBack: program.percentBack?.toNumber() ?? null,
      spendThreshold: program.spendThreshold?.toNumber() ?? null,
      rewardPercent: program.rewardPercent?.toNumber() ?? null,
      maxDailyBudget: program.maxDailyBudget?.toNumber() ?? null,
      budget: program.budget?.toNumber() ?? null,
      fundedAmount: program.fundedAmount?.toNumber() ?? null,
      spentAmount: program.spentAmount?.toNumber() ?? null,
      offerType: program.offerType,
      status: program.status,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
    };
  }
}
