import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BalancesService {
  constructor(private readonly prisma: PrismaService) {}

  async addPoints(
    userId: string,
    points: Decimal,
    tx?: Prisma.TransactionClient,
  ) {
    const db = this.getDb(tx);
    const balance = await this.getBalance(userId, tx);

    return db.userBalance.update({
      where: { userId },
      data: { balance: balance.add(points) },
    });
  }

  async subtractPoints(
    userId: string,
    points: Decimal,
    tx?: Prisma.TransactionClient,
  ) {
    const db = this.getDb(tx);
    const balance = await this.getBalance(userId, tx);

    if (balance.lt(points)) {
      throw new BadRequestException('Insufficient balance');
    }

    return db.userBalance.update({
      where: { userId },
      data: { balance: balance.sub(points) },
    });
  }

  async transferPoints(
    fromUserId: string,
    toUserId: string,
    points: Decimal,
    tx?: Prisma.TransactionClient,
  ) {
    if (tx) {
      await this.subtractPoints(fromUserId, points, tx);
      return this.addPoints(toUserId, points, tx);
    }

    return this.prisma.$transaction(async (newTx) => {
      await this.subtractPoints(fromUserId, points, newTx);
      return this.addPoints(toUserId, points, newTx);
    });
  }

  async getBalance(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Decimal> {
    const db = this.getDb(tx);

    const balance = await db.userBalance.findUnique({
      where: { userId },
      select: { balance: true },
    });

    if (balance) {
      return balance.balance;
    }

    const created = await db.userBalance.create({
      data: {
        userId,
        balance: 0,
      },
      select: { balance: true },
    });

    return created.balance;
  }

  private getDb(tx?: Prisma.TransactionClient | PrismaService) {
    return tx ?? this.prisma;
  }
}
