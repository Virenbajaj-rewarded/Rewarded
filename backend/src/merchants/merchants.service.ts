import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { CreateMerchantRequestDto } from './dto/create-merchant.request.dto';
import { AdminListMerchantsQueryDto } from './dto/admin-list-merchants.query';
import {
  LedgerEventType,
  Merchant,
  MerchantStatus,
  StoreType,
} from '@prisma/client';
import * as crypto from 'crypto';
import { SendgridService } from '../common/modules/sendgrid/sendgrid.service';
import { merchantApprovedTemplate } from '../common/modules/sendgrid/templates/merchant-approved.template';
import { UserRole } from '../users/types/user-role.enum';
import { FileStorageService } from '../common/modules/file-storage/file-storage.service';
import { Paginated } from '../common/dto/paginated';
import { MerchantListItemDto } from './dto/merchant-list-item.dto';
import { CreateMerchantResponseDto } from './dto/create-merchant.response.dto';
import { UploadLogoResponseDto } from './dto/upload-logo.response.dto';
import { MerchantOnboardingInfoDto } from './dto/merchant-onboarding-info.dto';
import { merchantSuspendedTemplate } from '../common/modules/sendgrid/templates/merchant-suspended.template';
import { MerchantProfileResponseDto } from './dto/merchant-profile.response.dto';
import { UpdateMerchantRequestDto } from './dto/update-merchant-profile.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { MerchantStatsOverviewDto } from './dto/merchant-stats-overview.dto';
import { CustomerStatsDto } from './dto/customer-stats.dto';
import { PaginationQueryDto } from '../common/dto/pagination.query.dto';
import { LedgerEventUser } from '../users/types/ledger-event.user';
import { MerchantTransactionItemDto } from './dto/merchant-transaction-item.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MerchantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendgridService: SendgridService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createPendingApplication(
    dto: CreateMerchantRequestDto,
  ): Promise<CreateMerchantResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User already exists with this email');
    }

    return this.prisma.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          fullName: dto.fullName,
          businessName: dto.businessName,
          businessEmail: dto.email,
          businessPhoneNumber: dto.phoneNumber,
          businessAddress: dto.location.address,
          storeType: dto.industry,
          status: MerchantStatus.PENDING,
        },
      });

      await tx.$executeRawUnsafe(
        `UPDATE "merchants"
             SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
             WHERE id = $3::uuid`,
        dto.location.longitude,
        dto.location.latitude,
        merchant.id,
      );

      return merchant;
    });
  }

  async getMerchantByOnboardingToken(
    token: string,
  ): Promise<MerchantOnboardingInfoDto> {
    const record = await this.prisma.merchantOnboardingToken.findUnique({
      where: { token },
      include: {
        merchant: {
          select: {
            id: true,
            businessEmail: true,
            businessName: true,
          },
        },
      },
    });

    if (!record || record.used) {
      throw new NotFoundException('Invalid or already used onboarding token');
    }

    return {
      id: record.merchant.id,
      email: record.merchant.businessEmail,
      businessName: record.merchant.businessName,
    };
  }

  async getMyProfile(firebaseUid: string): Promise<MerchantProfileResponseDto> {
    const [row] = await this.prisma.$queryRawUnsafe<
      Array<{
        id: string;
        businessName: string;
        businessEmail: string | null;
        businessPhoneNumber: string | null;
        businessAddress: string;
        description: string | null;
        storeType: StoreType;
        businessCode: string | null;
        tgUsername: string | null;
        whatsppUsername: string | null;
        logoKey: string | null;
        status: MerchantStatus;
        suspendReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
        rewardProgram: any | null;
        userId: string;
        userEmail: string;
        userRole: string;
      }>
    >(
      `
              SELECT
                  m."id",
                  m."businessName",
                  m."businessEmail",
                  m."businessPhoneNumber",
                  m."businessAddress",
                  m."description",
                  m."storeType",
                  m."businessCode",
                  m."tgUsername",
                  m."whatsppUsername",
                  m."logoKey",
                  m."status",
                  m."suspendReason",
                  m."createdAt",
                  m."updatedAt",

                  ST_Y(m."location") AS "latitude",
                  ST_X(m."location") AS "longitude",

                  (
                      SELECT jsonb_build_object(
                                     'id', rp."id",
                                     'name', rp."name",
                                     'strategy', rp."strategy",
                                     'percentBack', (rp."percentBack")::float,
                                     'spendThreshold', (rp."spendThreshold")::float,
                                     'rewardPercent', (rp."rewardPercent")::float,
                                     'maxDailyBudget', (rp."maxDailyBudget")::float,
                                     'offerType', rp."offerType"
                             )
                      FROM reward_programs rp
                      WHERE rp."merchantId" = m."id"
                        AND rp."status" = 'ACTIVE'
                      ORDER BY rp."createdAt" DESC
                                        LIMIT 1
                  ) AS "rewardProgram",

      u."id"   AS "userId",
      u."email" AS "userEmail",
      r."name" AS "userRole"

              FROM merchants m
                  JOIN users u ON m."userId" = u."id"
                  JOIN roles r ON u."roleId" = r."id"
              WHERE u."firebaseId" = $1
          `,
      firebaseUid,
    );

    if (!row) throw new NotFoundException('Merchant profile not found');

    const logoUrl = row.logoKey
      ? await this.fileStorageService.getReadUrl(row.logoKey)
      : null;

    return {
      id: row.id,
      businessName: row.businessName,
      businessEmail: row.businessEmail,
      businessPhoneNumber: row.businessPhoneNumber,
      businessCode: row.businessCode,
      description: row.description,
      storeType: row.storeType,
      logoUrl,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      tgUsername: row.tgUsername,
      whatsppUsername: row.whatsppUsername,
      location: {
        address: row.businessAddress,
        latitude: row.latitude,
        longitude: row.longitude,
      },
      activeRewardProgram: row.rewardProgram,
      user: {
        id: row.userId,
        email: row.userEmail,
        role: row.userRole as UserRole,
      },
    };
  }

  async list(
    query: AdminListMerchantsQueryDto,
  ): Promise<Paginated<MerchantListItemDto>> {
    const status = (query.status as MerchantStatus) ?? MerchantStatus.PENDING;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where = { status };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.merchant.count({ where }),
      this.prisma.merchant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          fullName: true,
          storeType: true,
          businessCode: true,
          businessName: true,
          businessEmail: true,
          businessPhoneNumber: true,
          businessAddress: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          suspendReason: true,
        },
      }),
    ]);

    return new Paginated<MerchantListItemDto>(items, total, page, limit);
  }

  async getMerchantByFirebaseId(firebaseId: string): Promise<Merchant> {
    const merchant = await this.prisma.merchant.findFirst({
      where: { user: { firebaseId } },
    });

    if (!merchant) throw new NotFoundException('Merchant not found');

    return merchant;
  }

  async approve(merchantId: string): Promise<MerchantListItemDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        status: true,
        businessEmail: true,
        businessName: true,
        userId: true,
      },
    });
    if (!merchant) throw new NotFoundException('Merchant not found');

    if (merchant.status !== MerchantStatus.PENDING) {
      throw new BadRequestException(
        `Only ${MerchantStatus.PENDING} merchants can be approved`,
      );
    }

    const businessCode = await this.generateUniqueBusinessCode();

    const updated = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: MerchantStatus.APPROVED,
        suspendReason: null,
        businessCode,
      },
      select: {
        id: true,
        fullName: true,
        businessName: true,
        businessEmail: true,
        businessPhoneNumber: true,
        businessAddress: true,
        storeType: true,
        status: true,
        businessCode: true,
        createdAt: true,
        updatedAt: true,
        suspendReason: true,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.merchantOnboardingToken.upsert({
      where: { merchantId: updated.id },
      update: { token, used: false },
      create: { merchantId: updated.id, token },
    });

    const link = `${process.env.DASHBOARD_URL}/set-password?token=${token}`;
    await this.sendgridService.send(
      updated.businessEmail,
      'Your merchant account has been approved',
      merchantApprovedTemplate(updated.businessName, link),
    );

    return updated;
  }

  async suspend(
    merchantId: string,
    reason: string,
  ): Promise<MerchantListItemDto> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        status: true,
        businessEmail: true,
        businessName: true,
      },
    });

    if (!merchant) throw new NotFoundException('Merchant not found');

    if (merchant.status !== MerchantStatus.PENDING) {
      throw new BadRequestException(
        `Only merchants with status ${MerchantStatus.PENDING} can be suspended`,
      );
    }

    const updated = await this.prisma.merchant.update({
      where: { id: merchantId },
      data: {
        status: MerchantStatus.SUSPENDED,
        suspendReason: reason,
      },
      select: {
        id: true,
        fullName: true,
        businessCode: true,
        businessName: true,
        businessEmail: true,
        businessPhoneNumber: true,
        businessAddress: true,
        storeType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        suspendReason: true,
      },
    });

    await this.sendgridService.send(
      updated.businessEmail,
      'Your merchant application was suspended',
      merchantSuspendedTemplate({
        businessName: updated.businessName,
        reason,
      }),
    );

    return updated;
  }

  async uploadLogo(
    firebaseId: string,
    file: Express.Multer.File,
  ): Promise<UploadLogoResponseDto> {
    const merchant = await this.getMerchantByFirebaseId(firebaseId);

    const logoKey = await this.fileStorageService.upload(file, 'logos');

    await this.prisma.merchant.update({
      where: { id: merchant.id },
      data: { logoKey },
    });

    const readUrl = await this.fileStorageService.getReadUrl(logoKey);
    return { logoUrl: readUrl };
  }

  async getTransactions(
    firebaseId: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<MerchantTransactionItemDto>> {
    const merchant = await this.getMerchantByFirebaseId(firebaseId);
    const merchantUserId = merchant.userId;

    const where = {
      OR: [{ fromUserId: merchantUserId }, { toUserId: merchantUserId }],
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

    const resolveName = (u: LedgerEventUser | null): string | null => {
      if (!u) return null;
      if (u.role?.name === UserRole.MERCHANT) {
        return u.merchant?.businessName ?? null;
      }
      return u.fullName ?? null;
    };

    const mapMerchantType = (e: any): LedgerEventType => {
      switch (e.type) {
        case LedgerEventType.REDEEM:
          return e.fromUserId === merchantUserId
            ? LedgerEventType.REDEEM
            : LedgerEventType.EARN;

        case LedgerEventType.REFUND:
          return LedgerEventType.REFUND;

        case LedgerEventType.PROGRAM_REPLENISHMENT:
          return LedgerEventType.PROGRAM_REPLENISHMENT;

        default:
          return e.type;
      }
    };

    const resolveDelta = (type: LedgerEventType, points: Decimal): Decimal => {
      switch (type) {
        case LedgerEventType.REDEEM:
        case LedgerEventType.PROGRAM_REPLENISHMENT:
          return points.neg();

        case LedgerEventType.EARN:
        case LedgerEventType.REFUND:
          return points;

        default:
          return points;
      }
    };

    const items: MerchantTransactionItemDto[] = events.map((e) => {
      const mappedType = mapMerchantType(e);
      const delta = resolveDelta(mappedType, e.points);

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

  async getStats(firebaseId: string): Promise<MerchantStatsOverviewDto> {
    const merchant = await this.getMerchantByFirebaseId(firebaseId);

    if (!merchant.userId) {
      throw new BadRequestException('Merchant user is not linked');
    }

    const merchantUserId = merchant.userId;

    const [stats] = await this.prisma.$queryRawUnsafe<
      {
        totalCustomers: number;
        newCustomersLastMonth: number;
        totalPointsCredited: number;
        totalPointsRedeemed: number;
      }[]
    >(
      `
              WITH
                  interactions AS (
                      SELECT
                          CASE
                              WHEN le."fromUserId" = $1::uuid THEN le."toUserId"
                              ELSE le."fromUserId"
                              END AS "customerId",
                          le."createdAt",
                          le."type",
                          le."points",
                          le."fromUserId",
                          le."toUserId"
                      FROM "ledger_events" le
                      WHERE le."fromUserId" = $1::uuid OR le."toUserId" = $1::uuid
                  ),

                  first_visits AS (
              SELECT
                  "customerId",
                  MIN("createdAt") AS "firstVisit"
              FROM interactions
              WHERE "customerId" IS NOT NULL
              GROUP BY "customerId"
                  ),

                  date_bounds AS (
              SELECT
                  date_trunc('month', now()) AS this_month,
                  date_trunc('month', now()) - interval '1 month' AS prev_month
                  )

              SELECT
                      (SELECT COUNT(*) FROM first_visits) AS "totalCustomers",

                      (SELECT COUNT(*)
                       FROM first_visits, date_bounds
                       WHERE "firstVisit" >= prev_month
                         AND "firstVisit" < this_month
                      ) AS "newCustomersLastMonth",

                      COALESCE((
                                   SELECT SUM(points)
                                   FROM interactions
                                   WHERE type = 'REDEEM'
                                     AND "fromUserId" = $1::uuid
                          ), 0) AS "totalPointsCredited",

                      COALESCE((
                                   SELECT SUM(points)
                                   FROM interactions
                                   WHERE type = 'REDEEM'
                                     AND "toUserId" = $1::uuid
                          ), 0) AS "totalPointsRedeemed"
              ;
          `,
      merchantUserId,
    );

    return {
      totalCustomers: Number(stats.totalCustomers),
      newCustomersLastMonth: Number(stats.newCustomersLastMonth),
      totalPointsCredited: Number(stats.totalPointsCredited),
      totalPointsRedeemed: Number(stats.totalPointsRedeemed),
    };
  }

  async getCustomers(
    firebaseId: string,
    pagination: PaginationQueryDto,
  ): Promise<Paginated<CustomerStatsDto>> {
    const merchant = await this.getMerchantByFirebaseId(firebaseId);
    const merchantUserId = merchant.userId;

    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const rows = await this.prisma.$queryRaw<
      {
        customerId: string;
        fullName: string | null;
        earned: number;
        spent: number;
        total: number;
      }[]
    >`
      WITH related_events AS (
          SELECT 
              le."fromUserId",
              le."toUserId",
              le.points,
              le.type,
              le."createdAt"
          FROM ledger_events le
          WHERE 
              le.type = 'REDEEM'
              AND (
                  le."fromUserId" = ${merchantUserId}::uuid
               OR le."toUserId" = ${merchantUserId}::uuid
              )
      ),
    
      customers AS (
          SELECT DISTINCT 
              u.id AS "customerId",
              u."fullName"
          FROM users u
          JOIN related_events re
            ON re."fromUserId" = u.id OR re."toUserId" = u.id
          WHERE u.id != ${merchantUserId}::uuid
      ),
    
      aggregated AS (
          SELECT
              c."customerId",
              c."fullName",

              MIN(re."createdAt") AS "firstTransactionAt",
    
              -- earned: customer → merchant
              COALESCE(SUM(
                  CASE
                    WHEN re."fromUserId" = c."customerId"
                     AND re."toUserId" = ${merchantUserId}::uuid
                    THEN re.points ELSE 0 END
              ), 0) AS earned,
    
              -- spent: merchant → customer
              COALESCE(SUM(
                  CASE
                    WHEN re."fromUserId" = ${merchantUserId}::uuid
                     AND re."toUserId" = c."customerId"
                    THEN re.points ELSE 0 END
              ), 0) AS spent
    
          FROM customers c
          LEFT JOIN related_events re
            ON (re."fromUserId" = c."customerId" OR re."toUserId" = c."customerId")
          GROUP BY c."customerId", c."fullName"
      ),
    
      final AS (
          SELECT 
              *,
              COUNT(*) OVER() AS total
          FROM aggregated
          ORDER BY "firstTransactionAt" DESC
          LIMIT ${limit} OFFSET ${offset}
      )
    
      SELECT * FROM final;
  `;

    if (!rows.length) return new Paginated([], 0, page, limit);

    const total = Number(rows[0].total);

    const items: CustomerStatsDto[] = rows.map((r) => ({
      customerId: r.customerId,
      fullName: r.fullName,
      earned: Number(r.earned),
      spent: Number(r.spent),
    }));

    return new Paginated(items, total, page, limit);
  }

  async updateMerchant(
    firebaseUid: string,
    dto: UpdateMerchantRequestDto,
  ): Promise<SuccessResponseDto> {
    const merchant = await this.getMerchantByFirebaseId(firebaseUid);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.merchant.update({
        where: { id: merchant.id },
        data: {
          businessName: dto.businessName,
          businessEmail: dto.businessEmail,
          businessPhoneNumber: dto.businessPhoneNumber,
          businessAddress: dto.location.address,
          storeType: dto.storeType,
          description: dto.description,
          tgUsername: dto.tgUsername,
          whatsppUsername: dto.whatsppUsername,
        },
      });

      if (dto.location) {
        const { latitude, longitude } = dto.location;

        await tx.$executeRawUnsafe(
          `UPDATE "merchants"
                     SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)
                     WHERE id = $3::uuid`,
          longitude,
          latitude,
          merchant.id,
        );
      }

      return new SuccessResponseDto(true);
    });
  }

  private async generateUniqueBusinessCode(): Promise<string> {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let code: string;
    let exists = true;

    while (exists) {
      code = Array.from(
        { length: 6 },
        () => charset[Math.floor(Math.random() * charset.length)],
      ).join('');

      const found = await this.prisma.merchant.findUnique({
        where: { businessCode: code },
        select: { id: true },
      });

      exists = !!found;
    }

    return code;
  }
}
