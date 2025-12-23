import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { MerchantsModule } from '../merchants/merchants.module';
import { UsersModule } from '../users/users.module';
import { BalancesModule } from '../balances/balances.module';

@Module({
  imports: [UsersModule, MerchantsModule, BalancesModule],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
