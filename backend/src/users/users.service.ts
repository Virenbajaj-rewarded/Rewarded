import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import {
  LedgerEventType,
  MerchantStatus,
  OfferType,
  Prisma,
  RewardProgramStatus,
  RewardStrategy,
  Role,
  StoreType,
} from '@prisma/client';
import { CreateUserParams } from './types/create-user.params';
import { UserRole } from './types/user-role.enum';
import { CreateUserResponseDto } from './dto/create-user.response.dto';
import { UserStoreDto } from './dto/user-store.dto';
import { Paginated } from '../common/dto/paginated';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { FileStorageService } from '../common/modules/file-storage/file-storage.service';
import { UserProfileResponseDto } from './dto/user-profile.response.dto';
import { PaginationQueryDto } from '../common/dto/pagination.query.dto';
import { UserTransactionItemDto } from './dto/user-transaction-item.dto';
import { UserProfileWithBalancesDto } from './dto/user-profile-with-balances.dto';
import { UserStoreDetailsDto } from './dto/user-store-details.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { RegisterUserBodyDto } from '../auth/guards/register-user.body.dto';
import { BalancesService } from '../balances/balances.service';
import { LedgerEventUser } from './types/ledger-event.user';
import { DiscoverStoresQueryDto } from './dto/discover-stores.query.dto';
import { UserBalanceDto } from './dto/user.balance.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { UserSpendingByIndustryDto, UserStatsDto } from './dto/user-stats.dto';
import { UserLastExpenseItemDto } from './dto/user-last-expense-item.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
    private readonly balanceService: BalancesService,
  ) {}

  async findById(
    id: string,
    include: Prisma.UserInclude = {},
  ): Promise<Prisma.UserGetPayload<{ include: typeof include }>> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { ...include },
    });
  }

  async findByFirebaseId(
    firebaseId: string,
    include: Prisma.UserInclude = {},
  ): Promise<Prisma.UserGetPayload<{ include: typeof include }>> {
    return this.prisma.user.findUnique({
      where: { firebaseId },
      include: { ...include },
    });
  }

  async findByEmail(
    email: string,
    include: Prisma.UserInclude = {},
  ): Promise<Prisma.UserGetPayload<{ include: typeof include }>> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { ...include },
    });
  }

  async findUserByIdWithBalance(
    id: string,
  ): Promise<UserProfileWithBalancesDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isEmailConfirmed: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const balance = await this.balanceService.getBalance(user.id);

    return {
      ...user,
      role: user.role.name as UserRole,
      balance: balance.toNumber(),
    };
  }

  async getRoleByName(roleName: UserRole): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new BadRequestException(
        `Role ${roleName} is not seeded in database`,
      );
    }

    return role;
  }

  async getProfileByFirebaseId(
    firebaseId: string,
  ): Promise<UserProfileResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isEmailConfirmed: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      role: user.role.name as UserRole,
    };
  }

  async getUserBalanceByFirebaseId(
    firebaseId: string,
  ): Promise<UserBalanceDto> {
    const user = await this.findByFirebaseId(firebaseId, { merchant: true });
    const decimalBalance = await this.balanceService.getBalance(user.id);

    let budgetPoints: Decimal | null = null;

    if (user.merchant) {
      const result = await this.prisma.rewardProgram.aggregate({
        where: {
          merchantId: user.merchant.id,
        },
        _sum: {
          fundedAmount: true,
        },
      });

      budgetPoints = result._sum.fundedAmount ?? new Decimal(0);
    }

    return {
      points: Number(decimalBalance.toFixed(2)),
      budgetPoints: budgetPoints ? Number(budgetPoints.toFixed(2)) : null,
    };
  }

  async createOrReturnExistingOne(
    params: CreateUserParams &
      RegisterUserBodyDto & { isGoogleProvider?: boolean },
  ): Promise<CreateUserResponseDto> {
    const { firebaseId, email, fullName, phoneNumber, isGoogleProvider } =
      params;

    const existingUser = await this.findByFirebaseId(firebaseId, {
      role: true,
    });
    if (existingUser) {
      return {
        id: existingUser.id,
        email: existingUser.email,
        phoneNumber: existingUser.phone,
        role: existingUser.role.name as UserRole,
        isEmailConfirmed: existingUser.isEmailConfirmed,
      };
    }

    const role = await this.getRoleByName(UserRole.USER);

    const newUser = await this.prisma.user.create({
      data: {
        firebaseId,
        email,
        fullName: fullName ?? null,
        phone: phoneNumber ?? null,
        roleId: role.id,
        isEmailConfirmed: isGoogleProvider,
      },
      include: { role: true },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      phoneNumber: newUser.phone,
      role: newUser.role.name as UserRole,
      isEmailConfirmed: newUser.isEmailConfirmed,
    };
  }

  async getMyStores(
    firebaseId: string,
    page = 1,
    limit = 10,
    storeType?: StoreType,
  ): Promise<Paginated<UserStoreDto>> {
    const offset = (page - 1) * limit;

    const [user] = await this.prisma.$queryRawUnsafe<
      { id: string; location: string | null }[]
    >(
      `
      SELECT 
        u.id,
        ST_AsText(u.location) AS location
      FROM "users" u
      WHERE u."firebaseId" = $1
      LIMIT 1
    `,
      firebaseId,
    );

    if (!user) throw new Error('User not found');

    const userId = user.id;
    const userLocationWKT = user.location;

    const userLocationSQL = userLocationWKT
      ? `ST_GeomFromText('${userLocationWKT}', 4326)`
      : null;

    const params = [userId];
    if (storeType) params.push(storeType);

    const typeFilter = storeType ? `AND m."storeType" = $2::"StoreType"` : '';

    const distanceSelect = userLocationSQL
      ? `ROUND(
       (ST_Distance(${userLocationSQL}::geography, wp.location::geography) / 1000)::numeric,
       2
     ) AS distance`
      : `NULL AS distance`;

    const mainQuery = `
    WITH earned AS (
        SELECT DISTINCT
            m.id, m."businessCode", m."businessName", m."storeType", m."logoKey", m.location
        FROM ledger_events le
        JOIN reward_programs rp ON rp.id = le."programId"
        JOIN merchants m ON m.id = rp."merchantId"
        WHERE le.type = 'REDEEM'
          AND m."businessCode" IS NOT NULL
          AND le."toUserId" = $1::uuid
          AND NOT EXISTS (
          SELECT 1
          FROM "UserStorePreference" usp
          WHERE usp."userId" = $1::uuid
          AND usp."merchantId" = m.id
          AND usp.removed = true
          )
        ${typeFilter}
    ),

    liked AS (
        SELECT DISTINCT
            m.id, m."businessCode", m."businessName", m."storeType", m."logoKey", m.location
        FROM "UserStorePreference" usp
        JOIN merchants m ON m.id = usp."merchantId"
        WHERE usp."userId" = $1::uuid
          AND m."businessCode" IS NOT NULL
          AND usp.removed = false
        ${typeFilter}
    ),

    base AS (
        SELECT * FROM earned
        UNION
        SELECT * FROM liked
    ),

    with_program AS (
        SELECT
            b.id,
            b."businessCode",
            b."businessName",
            b."storeType",
            b."logoKey",
            b.location,

            rp.id  AS "rpId",
            rp.name AS "rpName",
            rp.strategy AS "rpStrategy",
            rp."percentBack" AS "rpPercentBack",
            rp."spendThreshold" AS "rpSpendThreshold",
            rp."rewardPercent" AS "rpRewardPercent",
            rp."maxDailyBudget" AS "rpMaxDailyBudget",
            rp."offerType" AS "rpOfferType"
        FROM base b
        LEFT JOIN LATERAL (
            SELECT *
            FROM reward_programs rp
            WHERE rp."merchantId" = b.id
              AND rp.status = 'ACTIVE'
            LIMIT 1
        ) rp ON true
    ),

    with_points AS (
        SELECT
            wp.id,
            wp."businessCode",
            wp."businessName",
            wp."storeType",
            wp."logoKey",

            wp."rpId",
            wp."rpName",
            wp."rpStrategy",
            wp."rpPercentBack",
            wp."rpSpendThreshold",
            wp."rpRewardPercent",
            wp."rpMaxDailyBudget",
            wp."rpOfferType",

        COALESCE((
        SELECT SUM(le.points)
        FROM ledger_events le
        WHERE le.type = 'REDEEM'
        AND le."toUserId" = $1::uuid
        AND le."programId" = wp."rpId"
        ), 0) AS "rewardPoints",
            
        CASE
            WHEN wp."rpStrategy" = 'SPEND_TO_EARN'
            THEN cp."accumulatedAmount"
            ELSE NULL
        END AS "userProgress",

        ${distanceSelect}

    FROM with_program wp
        LEFT JOIN "customer-progresses" cp
    ON cp."consumerId" = $1::uuid
        AND cp."programId" = wp."rpId"
        AND cp."merchantId" = wp.id
        )

    SELECT *
    FROM with_points
    ORDER BY
        CASE
            WHEN "rewardPoints" > 0 THEN 0
            ELSE 1
            END,
        CASE
            WHEN "rewardPoints" > 0 THEN "rewardPoints"
            ELSE NULL
            END DESC,
        "businessName" ASC
    OFFSET ${storeType ? '$3' : '$2'}
    LIMIT  ${storeType ? '$4' : '$3'};
  `;

    const paginationParams = storeType
      ? [...params, offset, limit]
      : [...params, offset, limit];

    const merchants = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        businessCode: string;
        businessName: string;
        logoKey?: string;
        storeType?: StoreType;
        rewardPoints: number;
        distance?: string | null;

        rpId?: string | null;
        rpName?: string | null;
        rpStrategy?: RewardStrategy | null;
        rpPercentBack?: number | null;
        rpSpendThreshold?: number | null;
        rpRewardPercent?: number | null;
        rpMaxDailyBudget?: number | null;
        rpOfferType?: OfferType | null;
        userProgress?: string | null;
      }[]
    >(mainQuery, ...paginationParams);

    const countQuery = `
    SELECT COUNT(*)::int AS count FROM (
      SELECT DISTINCT id FROM (
        ${mainQuery.replace(/OFFSET[\s\S]*/, '')}
      ) t
    ) sub;
  `;

    const [{ count }] = await this.prisma.$queryRawUnsafe<{ count: number }[]>(
      countQuery,
      ...paginationParams,
    );

    const items: UserStoreDto[] = [];

    for (const m of merchants) {
      const logoUrl = m.logoKey
        ? await this.fileStorageService.getReadUrl(m.logoKey)
        : undefined;

      items.push({
        id: m.id,
        businessCode: m.businessCode,
        name: m.businessName,
        logoUrl,
        storeType: m.storeType,
        rewardPoints: Number(m.rewardPoints),
        distance: m.distance ? Number(m.distance) : null,
        isLiked: true,
        activeRewardProgram: m.rpId
          ? {
              id: m.rpId,
              name: m.rpName,
              strategy: m.rpStrategy,
              percentBack: m.rpPercentBack ? Number(m.rpPercentBack) : null,
              spendThreshold: m.rpSpendThreshold
                ? Number(m.rpSpendThreshold)
                : null,
              rewardPercent: m.rpRewardPercent
                ? Number(m.rpRewardPercent)
                : null,
              maxDailyBudget: m.rpMaxDailyBudget
                ? Number(m.rpMaxDailyBudget)
                : null,
              offerType: m.rpOfferType,
              userProgress:
                m.userProgress !== null ? Number(m.userProgress) : null,
            }
          : null,
      });
    }

    return new Paginated(items, count, page, limit);
  }

  async discoverStores(
    firebaseId: string,
    query: DiscoverStoresQueryDto,
  ): Promise<Paginated<UserStoreDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const [user] = await this.prisma.$queryRawUnsafe<
      { id: string; location: string | null }[]
    >(
      `
                SELECT id, ST_AsText(location) AS location
                FROM "users"
                WHERE "firebaseId" = $1
                LIMIT 1
            `,
      firebaseId,
    );

    if (!user) throw new Error('User not found');

    const userLocationSQL = user.location
      ? `ST_GeomFromText('${user.location}', 4326)`
      : null;

    const distanceSelect = userLocationSQL
      ? `ROUND(
        (ST_Distance(${userLocationSQL}::geography, m.location::geography) / 1000)::numeric,
        2
      )`
      : `NULL`;

    const params: any[] = [user.id];
    let idx = 2;

    let searchFilter = '';
    if (query.search) {
      searchFilter = `
      AND (
        m."businessName" ILIKE $${idx}
        OR m."businessCode" ILIKE $${idx}
      )
    `;
      params.push(`%${query.search}%`);
      idx++;
    }

    let typeFilter = '';
    if (query.storeType) {
      typeFilter = `AND m."storeType" = $${idx}::"StoreType"`;
      params.push(query.storeType);
      idx++;
    }

    const mainQuery = `
            SELECT
                m.id,
                m."businessCode",
                m."businessName",
                m."storeType",
                m."logoKey",

                ${distanceSelect} AS distance,

                (
                    EXISTS (
                        SELECT 1
                        FROM "UserStorePreference" usp
                        WHERE usp."userId" = $1::uuid
                            AND usp."merchantId" = m.id
                            AND usp.removed = false
                    )
                        OR
                    EXISTS (
                        SELECT 1
                        FROM ledger_events le
                                 JOIN reward_programs rp2 ON rp2.id = le."programId"
                        WHERE le.type = 'EARN'
                          AND le."toUserId" = $1::uuid
                            AND rp2."merchantId" = m.id
                    )
                    ) AS "isLiked",

                rp.id AS "rpId",
                rp.name AS "rpName",
                rp.strategy AS "rpStrategy",
                rp."percentBack" AS "rpPercentBack",
                rp."spendThreshold" AS "rpSpendThreshold",
                rp."rewardPercent" AS "rpRewardPercent",
                rp."maxDailyBudget" AS "rpMaxDailyBudget",
                rp."offerType" AS "rpOfferType"

            FROM merchants m
                     INNER JOIN reward_programs rp
                                ON rp."merchantId" = m.id
                                    AND rp.status = 'ACTIVE'

            WHERE m."businessCode" IS NOT NULL
                ${searchFilter}
                ${typeFilter}

            ORDER BY
                distance ASC NULLS LAST,
                m."businessName" ASC

                LIMIT ${limit} OFFSET ${offset};
        `;

    const merchants = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        businessCode: string;
        businessName: string;
        storeType: StoreType;
        logoKey: string | null;

        distance: number | null;
        isLiked: boolean;

        rpId: string;
        rpName: string;
        rpStrategy: RewardStrategy;
        rpPercentBack: number | null;
        rpSpendThreshold: number | null;
        rpRewardPercent: number | null;
        rpMaxDailyBudget: number;
        rpOfferType: OfferType;
      }[]
    >(mainQuery, ...params);

    const countQuery = `
            SELECT COUNT(*)::int AS count
            FROM merchants m
                INNER JOIN reward_programs rp
            ON rp."merchantId" = m.id
                AND rp.status = 'ACTIVE'
            WHERE m."businessCode" IS NOT NULL
                ${searchFilter}
                ${typeFilter}
        `;

    const [{ count }] = await this.prisma.$queryRawUnsafe<{ count: number }[]>(
      countQuery,
      ...params,
    );

    const items: UserStoreDto[] = await Promise.all(
      merchants.map(async (m) => {
        const logoUrl = m.logoKey
          ? await this.fileStorageService.getReadUrl(m.logoKey)
          : null;

        return {
          id: m.id,
          name: m.businessName,
          businessCode: m.businessCode,
          logoUrl,
          storeType: m.storeType,
          distance: m.distance !== null ? Number(m.distance) : null,
          rewardPoints: null,
          isLiked: Boolean(m.isLiked),
          activeRewardProgram: {
            id: m.rpId,
            name: m.rpName,
            strategy: m.rpStrategy,
            offerType: m.rpOfferType,
            maxDailyBudget: Number(m.rpMaxDailyBudget),
            percentBack: m.rpPercentBack ? Number(m.rpPercentBack) : null,
            spendThreshold: m.rpSpendThreshold
              ? Number(m.rpSpendThreshold)
              : null,
            rewardPercent: m.rpRewardPercent ? Number(m.rpRewardPercent) : null,
            userProgress: null,
          },
        };
      }),
    );

    return new Paginated(items, count, page, limit);
  }

  async getMyStoreByCode(
    firebaseId: string,
    businessCode: string,
  ): Promise<UserStoreDetailsDto> {
    const user = await this.getProfileByFirebaseId(firebaseId);

    const [merchant] = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        merchantUserId: string;
        businessName: string;
        businessEmail?: string;
        businessPhoneNumber?: string;
        businessAddress?: string;
        businessCode: string;
        tgUsername?: string;
        whatsppUsername?: string;
        storeType?: StoreType;
        logoKey?: string;
        description?: string;
        longitude?: number;
        latitude?: number;
        distance?: number | null;
        isLiked: boolean;

        rewardId?: string;
        rewardName?: string;
        rewardOfferType?: OfferType;
        rewardMaxDailyBudget?: number;
        strategy?: RewardStrategy;
        percentBack?: number;
        spendThreshold?: number;
        rewardPercent?: number;
        userProgress?: number;

        reward_points: number;
        spent_points: number;

        status: MerchantStatus;
        createdAt: Date;
        updatedAt: Date;
      }[]
    >(
      `
          WITH user_loc AS (
              SELECT location
              FROM "users"
              WHERE id = $1::uuid
              )

          SELECT
              m.id,
              m."userId" AS "merchantUserId",
              m."businessName",
              m."businessEmail",
              m."businessPhoneNumber",
              m."businessAddress",
              m."businessCode",
              m."tgUsername",
              m."whatsppUsername",
              m."storeType",
              m."logoKey",
              m."description",
              m."status",
              m."createdAt",
              m."updatedAt",

              ST_X(m.location) AS longitude,
              ST_Y(m.location) AS latitude,

              CASE
                  WHEN (SELECT location FROM user_loc) IS NOT NULL THEN
                      ST_Distance(
                              (SELECT location::geography FROM user_loc),
                              m.location::geography
                      )
                  ELSE NULL
                  END AS distance,

              rp.id AS "rewardId",
              rp."name" AS "rewardName",
              rp."offerType" AS "rewardOfferType",
              rp."maxDailyBudget" AS "rewardMaxDailyBudget",
              rp.strategy,
              CAST(rp."percentBack" AS FLOAT) AS "percentBack",
              CAST(rp."spendThreshold" AS FLOAT) AS "spendThreshold",
              CAST(rp."rewardPercent" AS FLOAT) AS "rewardPercent",

              COALESCE(cp."accumulatedAmount", 0) AS "userProgress",

              -- reward points balance
              COALESCE(SUM(
                               CASE
                                   WHEN le.type = 'REDEEM' AND le."toUserId" = $1::uuid THEN le."points"
                                   WHEN le.type = 'REDEEM' AND le."fromUserId" = $1::uuid THEN -le."points"
                                   ELSE 0
                                   END
                       ), 0) AS reward_points,

              -- spent in rewards
              COALESCE(SUM(
                               CASE
                                   WHEN le.type = 'REDEEM' AND le."fromUserId" = $1::uuid THEN le."amount"
                                   ELSE 0
                                   END
                       ), 0) AS spent_points,

              -- is liked
              (
                EXISTS (
                    SELECT 1
                    FROM "UserStorePreference" usp
                    WHERE usp."userId" = $1::uuid
                      AND usp."merchantId" = m.id
                      AND usp.removed = false
                )
                OR
                COALESCE(SUM(
                    CASE
                        WHEN le.type = 'REDEEM'
                         AND le."fromUserId" = $1::uuid
                        THEN le."amount"
                        ELSE 0
                    END
                ), 0) > 0
              ) AS "isLiked"

          FROM merchants m
                   LEFT JOIN reward_programs rp
                             ON rp."merchantId" = m.id AND rp.status = 'ACTIVE'

                   LEFT JOIN "customer-progresses" cp
                             ON cp."merchantId" = m.id
                                 AND cp."consumerId" = $1::uuid
                                    AND cp."programId" = rp.id

            LEFT JOIN "ledger_events" le
          ON (le."fromUserId" = $1::uuid OR le."toUserId" = $1::uuid)
              AND le."programId" = rp.id

          WHERE m."businessCode" = $2

          GROUP BY
              m.id, rp.id, cp."accumulatedAmount", m.location

              LIMIT 1;
      `,
      user.id,
      businessCode,
    );

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    let activeRewardProgram = null;
    if (merchant.rewardId) {
      activeRewardProgram = {
        id: merchant.rewardId,
        name: merchant.rewardName,
        offerType: merchant.rewardOfferType,
        maxDailyBudget: merchant.rewardMaxDailyBudget,
        strategy: merchant.strategy,
        percentBack: merchant.percentBack,
        spendThreshold: merchant.spendThreshold,
        rewardPercent: merchant.rewardPercent,
        userProgress: merchant.userProgress ?? 0,
      };
    }

    const logoUrl = merchant.logoKey
      ? await this.fileStorageService.getReadUrl(merchant.logoKey)
      : undefined;

    const distanceKm = merchant.distance
      ? Math.round((Number(merchant.distance) / 1000) * 100) / 100
      : undefined;

    return {
      id: merchant.id,
      userId: merchant.merchantUserId,
      businessName: merchant.businessName,
      businessEmail: merchant.businessEmail,
      businessPhoneNumber: merchant.businessPhoneNumber,
      businessCode: merchant.businessCode,
      tgUsername: merchant.tgUsername,
      whatsppUsername: merchant.whatsppUsername,
      location:
        merchant.longitude && merchant.latitude && merchant.businessAddress
          ? {
              longitude: Number(merchant.longitude),
              latitude: Number(merchant.latitude),
              address: merchant.businessAddress,
            }
          : null,
      storeType: merchant.storeType,
      logoUrl,
      isLiked: Boolean(merchant.isLiked),
      description: merchant.description ?? null,
      distance: distanceKm,
      rewardPoints: Number(merchant.reward_points) ?? 0,
      spent: Number(merchant.spent_points) ?? 0,
      activeRewardProgram,
      status: merchant.status,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
    };
  }

  async likeStore(
    firebaseId: string,
    merchantId: string,
  ): Promise<SuccessResponseDto> {
    const user = await this.findByFirebaseId(firebaseId);

    await this.prisma.userStorePreference.upsert({
      where: {
        userId_merchantId: {
          userId: user.id,
          merchantId,
        },
      },
      update: {
        removed: false,
      },
      create: {
        userId: user.id,
        merchantId,
        removed: false,
      },
    });

    return new SuccessResponseDto(true);
  }

  async unlikeStore(
    firebaseId: string,
    merchantId: string,
  ): Promise<SuccessResponseDto> {
    const user = await this.findByFirebaseId(firebaseId);

    const activeProgram = await this.prisma.rewardProgram.findFirst({
      where: {
        merchantId,
        status: RewardProgramStatus.ACTIVE,
      },
      select: { id: true, strategy: true },
    });

    await this.prisma.$transaction(async (tx) => {
      await tx.userStorePreference.upsert({
        where: {
          userId_merchantId: {
            userId: user.id,
            merchantId,
          },
        },
        update: { removed: true },
        create: { userId: user.id, merchantId, removed: true },
      });

      if (
        activeProgram &&
        activeProgram.strategy === RewardStrategy.SPEND_TO_EARN
      ) {
        await tx.customerProgress.updateMany({
          where: {
            merchantId,
            consumerId: user.id,
            programId: activeProgram.id,
          },
          data: { accumulatedAmount: 0 },
        });
      }
    });

    return new SuccessResponseDto(true);
  }

  async updateLocation(
    firebaseId: string,
    dto: UpdateLocationDto,
  ): Promise<SuccessResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseId },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.$executeRawUnsafe(
      `
                UPDATE "users"
                SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
                WHERE id = $3
            `,
      dto.longitude,
      dto.latitude,
      user.id,
    );

    return new SuccessResponseDto(true);
  }

  async getTransactions(
    firebaseId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<UserTransactionItemDto>> {
    const user = await this.findByFirebaseId(firebaseId);
    const userId = user.id;

    const where = {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [total, events] = await Promise.all([
      this.prisma.ledgerEvent.count({ where }),
      this.prisma.ledgerEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          fromUser: {
            select: {
              id: true,
              fullName: true,
              role: { select: { name: true } },
              merchant: { select: { businessName: true } },
            },
          },
          toUser: {
            select: {
              id: true,
              fullName: true,
              role: { select: { name: true } },
              merchant: { select: { businessName: true } },
            },
          },
          program: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    const items: UserTransactionItemDto[] = events.map((e) => {
      let mappedType: LedgerEventType;

      if (e.toUserId === userId) {
        mappedType = LedgerEventType.EARN;
      } else if (e.fromUserId === userId) {
        mappedType = LedgerEventType.REDEEM;
      } else {
        mappedType = e.type;
      }

      const delta =
        mappedType === LedgerEventType.REDEEM ? e.points.neg() : e.points;

      const resolveName = (u: LedgerEventUser | null): string | null => {
        if (!u) return null;
        if (u.role?.name === UserRole.MERCHANT) {
          return u.merchant?.businessName ?? null;
        }
        return u.fullName ?? null;
      };

      return {
        id: e.id,
        type: mappedType,
        points: Number(delta.toFixed(2)),
        createdAt: e.createdAt.toISOString(),
        comment: e.comment ?? null,

        rewardProgramId: e.program?.id ?? null,
        rewardProgramName: e.program?.name ?? null,

        fromId: e.fromUser?.id ?? null,
        fromName: resolveName(e.fromUser),

        toId: e.toUser?.id ?? null,
        toName: resolveName(e.toUser),
      };
    });

    return {
      items,
      page: query.page,
      limit: query.limit,
      total,
    };
  }

  async getUserStats(firebaseId: string): Promise<UserStatsDto> {
    const user = await this.findByFirebaseId(firebaseId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    const [row] = await this.prisma.$queryRawUnsafe<
      {
        current_month_spent: number | null;
        total_spent: number | null;
        first_tx_date: Date | null;
        spending_by_industry: UserSpendingByIndustryDto[] | null;
      }[]
    >(
      `
          WITH base AS (
              SELECT
                  le.points,
                  le."createdAt",
                  m."storeType"
              FROM ledger_events le
                       JOIN merchants m
                            ON m."userId" = le."toUserId"
              WHERE le.type = 'REDEEM'
                AND le."fromUserId" = $1::uuid
              ),

              current_month AS (
          SELECT
              SUM(points) AS current_month_spent
          FROM base
          WHERE "createdAt" >= $2
              ),

              totals AS (
          SELECT
              SUM(points) AS total_spent,
              MIN("createdAt") AS first_tx_date
          FROM base
              ),

              by_industry AS (
          SELECT
              "storeType",
              SUM(points) AS amount
          FROM base
          WHERE "createdAt" >= $2
          GROUP BY "storeType"
              )

          SELECT
              cm.current_month_spent,
              t.total_spent,
              t.first_tx_date,
              json_agg(
                      json_build_object(
                              'industry', b."storeType",
                              'amount', b.amount
                      )
              ) FILTER (WHERE b."storeType" IS NOT NULL) AS spending_by_industry
          FROM current_month cm
                   CROSS JOIN totals t
                   LEFT JOIN by_industry b ON true
          GROUP BY cm.current_month_spent, t.total_spent, t.first_tx_date;
      `,
      user.id,
      oneMonthAgo,
    );

    const currentMonthSpent = Number(
      new Decimal(row?.current_month_spent ?? 0).toFixed(2),
    );

    let averageMonthlySpent = 0;

    if (row?.first_tx_date && row?.total_spent) {
      const firstDate = row.first_tx_date;

      const monthsDiff =
        (now.getUTCFullYear() - firstDate.getUTCFullYear()) * 12 +
        (now.getUTCMonth() - firstDate.getUTCMonth()) +
        1;

      averageMonthlySpent = Number(
        new Decimal(row.total_spent)
          .dividedBy(Math.max(1, monthsDiff))
          .toFixed(2),
      );
    }

    return {
      currentMonthSpent,
      averageMonthlySpent,
      spendingByIndustry: (row?.spending_by_industry ?? []).map((i) => ({
        industry: i.industry,
        amount: Number(new Decimal(i.amount).toFixed(2)),
      })),
    };
  }

  async getLastExpenses(
    firebaseId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<UserLastExpenseItemDto>> {
    const user = await this.findByFirebaseId(firebaseId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const oneMonthAgo = new Date();
    oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);

    const rows = await this.prisma.$queryRawUnsafe<
      {
        businessName: string;
        storeType: StoreType;
        logoKey: string | null;
        amount: number;
        points: number;
      }[]
    >(
      `
    SELECT
      m."businessName",
      m."storeType",
      m."logoKey",
      le."amount" AS amount,
      le."points" AS points
    FROM ledger_events le
    JOIN merchants m
      ON m."userId" = le."toUserId"
    WHERE le.type = 'REDEEM'
      AND le."fromUserId" = $1::uuid
      AND le."createdAt" >= $2
    ORDER BY le."createdAt" DESC
    LIMIT $3 OFFSET $4
    `,
      user.id,
      oneMonthAgo,
      limit,
      offset,
    );

    const [{ count }] = await this.prisma.$queryRawUnsafe<{ count: number }[]>(
      `
    SELECT COUNT(*)::int AS count
    FROM ledger_events le
    JOIN merchants m
      ON m."userId" = le."toUserId"
    WHERE le.type = 'REDEEM'
      AND le."fromUserId" = $1::uuid
      AND le."createdAt" >= $2
    `,
      user.id,
      oneMonthAgo,
    );

    const items: UserLastExpenseItemDto[] = await Promise.all(
      rows.map(async (row) => ({
        businessName: row.businessName,
        storeType: row.storeType,
        logoUrl: row.logoKey
          ? await this.fileStorageService.getReadUrl(row.logoKey)
          : null,
        amount: Number(new Decimal(row.amount).toFixed(2)),
        points: Number(new Decimal(row.points ?? 0).toFixed(2)),
      })),
    );

    return new Paginated(items, count, page, limit);
  }

  async updateUserProfile(
    firebaseId: string,
    dto: UpdateUserProfileDto,
  ): Promise<SuccessResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { firebaseId },
      include: { role: true, merchant: true },
    });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: dto.fullName ?? user.fullName,
      },
    });

    if (user.role.name === UserRole.MERCHANT && user.merchant) {
      await this.prisma.merchant.update({
        where: { id: user.merchant.id },
        data: { fullName: dto.fullName ?? user.merchant.fullName },
      });
    }

    return new SuccessResponseDto(true);
  }
}
