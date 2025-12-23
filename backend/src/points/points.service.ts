import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LedgerService } from '../ledger/ledger.service';
import { BalancesService } from '../balances/balances.service';
import { TransferPointsDto } from './dto/transfer-points.dto';
import {
  LedgerEventType,
  PaymentRequestStatus,
  RewardProgramStatus,
} from '@prisma/client';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PushService } from '../notifications/push.service';
import { NotificationType } from '../notifications/types/notification-types';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PointsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly ledgerService: LedgerService,
    private readonly balancesService: BalancesService,
    private readonly pushService: PushService,
  ) {}

  async transfer(
    firebaseUid: string,
    dto: TransferPointsDto,
  ): Promise<SuccessResponseDto> {
    const { points, toUserId, amount, comment } = dto;

    if (amount !== undefined && amount !== null) {
      if (points > amount) {
        throw new BadRequestException('Points cannot exceed paid sum');
      }
    }

    const fromUser = await this.usersService.findByFirebaseId(firebaseUid, {
      role: true,
      merchant: true,
    });

    if (!fromUser) {
      throw new BadRequestException('Sender not found');
    }

    const toUser = await this.usersService.findById(toUserId, {
      role: true,
    });

    if (!toUser) {
      throw new BadRequestException('Recipient not found');
    }

    const fromRole = fromUser.role.name;
    const toRole = toUser.role.name;

    if (fromRole === toRole) {
      throw new BadRequestException(
        'Transfers between same user roles are not allowed',
      );
    }

    const senderBalance = await this.balancesService.getBalance(fromUser.id);
    if (senderBalance.lt(points)) {
      throw new BadRequestException('Insufficient points balance');
    }

    let activeProgram: { id: string } | null = null;
    const merchant = fromUser.merchant;
    if (merchant) {
      activeProgram = await this.prisma.rewardProgram.findFirst({
        where: {
          merchantId: merchant.id,
          status: RewardProgramStatus.ACTIVE,
        },
        select: { id: true },
      });
    }

    return this.prisma.$transaction(async (tx) => {
      await this.ledgerService.createLedgerRecord(
        {
          type: LedgerEventType.REDEEM,
          points: new Decimal(0),
          comment: comment ?? `Transfer to ${toUser.fullName}`,
          fromUserId: fromUser.id,
          toUserId: toUser.id,
          amount: new Decimal(points),
          programId: activeProgram?.id ?? null,
        },
        tx,
      );

      await this.balancesService.transferPoints(
        fromUser.id,
        toUser.id,
        new Decimal(points),
        tx,
      );

      return new SuccessResponseDto(true);
    });
  }

  async createPaymentRequest(
    firebaseUid: string,
    dto: CreatePaymentRequestDto,
  ): Promise<SuccessResponseDto> {
    const { customerId, amount, comment } = dto;

    const merchantUser = await this.usersService.findByFirebaseId(firebaseUid, {
      merchant: true,
    });

    if (!merchantUser || !merchantUser.merchant) {
      throw new BadRequestException('Only merchant can request CAD points');
    }

    const merchant = merchantUser.merchant;

    const customer = await this.usersService.findById(customerId);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const request = await this.prisma.paymentRequest.create({
      data: {
        merchantId: merchant.id,
        customerId: customer.id,
        amount,
        comment,
        status: PaymentRequestStatus.PENDING,
      },
    });

    await this.pushService.sendToUser(customer.id, {
      title: 'Payment request',
      body: `${merchant.businessName} requested ${amount} points`,
      data: {
        type: NotificationType.PAYMENT_REQUEST_CREATED,
        requestId: request.id,
        comment,
      },
    });

    return new SuccessResponseDto(true);
  }

  async approve(firebaseUid: string, requestId: string) {
    const customer = await this.usersService.findByFirebaseId(firebaseUid);

    if (!customer) throw new BadRequestException('User not found');

    const request = await this.prisma.paymentRequest.findUnique({
      where: { id: requestId },
      include: { merchant: true },
    });

    if (!request || request.customerId !== customer.id) {
      throw new BadRequestException('Request not found');
    }

    if (request.status !== PaymentRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    const amount = request.amount;

    await this.prisma.$transaction(async (tx) => {
      const balance = await this.balancesService.getBalance(customer.id, tx);
      if (balance.lt(amount)) {
        throw new BadRequestException('Insufficient balance');
      }

      await this.ledgerService.createLedgerRecord(
        {
          type: LedgerEventType.REDEEM,
          amount: new Decimal(amount),
          points: new Decimal(0),
          fromUserId: customer.id,
          toUserId: request.merchant.userId,
          comment: `Payment request approved`,
        },
        tx,
      );

      await this.balancesService.transferPoints(
        customer.id,
        request.merchant.userId,
        amount,
        tx,
      );

      await tx.paymentRequest.update({
        where: { id: requestId },
        data: {
          status: PaymentRequestStatus.APPROVED,
        },
      });
    });

    await this.pushService.sendToUser(request.merchant.userId, {
      title: 'Payment approved',
      body: `${customer.fullName} approved payment of ${amount} points`,
      data: {
        type: NotificationType.PAYMENT_REQUEST_APPROVED,
        requestId,
      },
    });

    return new SuccessResponseDto(true);
  }

  async decline(firebaseUid: string, requestId: string) {
    const customer = await this.usersService.findByFirebaseId(firebaseUid);

    if (!customer) throw new BadRequestException('User not found');

    const request = await this.prisma.paymentRequest.findUnique({
      where: { id: requestId },
      include: { merchant: true },
    });

    if (!request || request.customerId !== customer.id) {
      throw new BadRequestException('Request not found');
    }

    if (request.status !== PaymentRequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    await this.prisma.paymentRequest.update({
      where: { id: requestId },
      data: {
        status: PaymentRequestStatus.DECLINED,
      },
    });

    await this.pushService.sendToUser(request.merchant.userId, {
      title: 'Payment declined',
      body: `${customer.fullName} declined payment`,
      data: {
        type: NotificationType.PAYMENT_REQUEST_DECLINED,
        requestId,
      },
    });

    return new SuccessResponseDto(true);
  }

  async pollUserRequests(firebaseUid: string) {
    const user = await this.usersService.findByFirebaseId(firebaseUid);
    if (!user) throw new BadRequestException('User not found');

    return this.prisma.paymentRequest.findFirst({
      where: {
        customerId: user.id,
        status: PaymentRequestStatus.PENDING,
        shownToUser: false,
      },
      orderBy: { createdAt: 'desc' },
      include: { merchant: { select: { businessName: true } } },
    });
  }

  async pollMerchant(firebaseUid: string) {
    const merchantUser = await this.usersService.findByFirebaseId(firebaseUid, {
      merchant: true,
    });
    if (!merchantUser || !merchantUser.merchant)
      throw new BadRequestException('Merchant not found.');

    return this.prisma.paymentRequest.findFirst({
      where: {
        merchantId: merchantUser.merchant.id,
        status: {
          in: [PaymentRequestStatus.APPROVED, PaymentRequestStatus.DECLINED],
        },
        shownToMerchant: false,
      },
      orderBy: { updatedAt: 'desc' },
      include: { customer: { select: { fullName: true } } },
    });
  }

  async markSeenByUser(firebaseUid: string, requestId: string) {
    const user = await this.usersService.findByFirebaseId(firebaseUid);
    if (!user) throw new BadRequestException('User not found');

    const request = await this.prisma.paymentRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new BadRequestException('Request not found');

    if (request.customerId !== user.id) {
      throw new BadRequestException(
        'You are not allowed to modify this request',
      );
    }

    await this.prisma.paymentRequest.update({
      where: { id: requestId },
      data: { shownToUser: true },
    });

    return new SuccessResponseDto(true);
  }

  async markSeenByMerchant(firebaseUid: string, requestId: string) {
    const merchantUser = await this.usersService.findByFirebaseId(firebaseUid, {
      merchant: true,
    });

    if (!merchantUser || !merchantUser.merchant) {
      throw new BadRequestException('Only merchants can perform this action');
    }

    const merchant = merchantUser.merchant;

    const request = await this.prisma.paymentRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new BadRequestException('Request not found');

    if (request.merchantId !== merchant.id) {
      throw new BadRequestException(
        'This request does not belong to your store',
      );
    }

    await this.prisma.paymentRequest.update({
      where: { id: requestId },
      data: { shownToMerchant: true },
    });

    return new SuccessResponseDto(true);
  }
}
