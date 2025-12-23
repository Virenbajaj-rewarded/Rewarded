import { Injectable } from '@nestjs/common';
import { LedgerEvent, LedgerEventType, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class LedgerService {
  constructor() {}

  async createLedgerRecord(
    data: {
      fromUserId?: string | null;
      toUserId?: string | null;
      programId?: string | null;
      type: LedgerEventType;
      points: Decimal;
      amount?: Decimal | null;
      idempotencyKey?: string | null;
      comment?: string | null;
    },
    tx: Prisma.TransactionClient,
  ): Promise<LedgerEvent> {
    return tx.ledgerEvent.create({
      data: {
        fromUserId: data.fromUserId ?? null,
        toUserId: data.toUserId ?? null,
        programId: data.programId ?? null,
        type: data.type,
        points: data.points,
        amount: data.amount ?? null,
        idempotencyKey: data.idempotencyKey ?? null,
        comment: data.comment ?? null,
      },
    });
  }
}
