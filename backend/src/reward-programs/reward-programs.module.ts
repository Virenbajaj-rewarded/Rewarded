import { RewardProgramsService } from './reward-programs.service';
import { Module } from '@nestjs/common';
import { RewardProgramsController } from './reward-programs.controller';
import { MerchantsModule } from '../merchants/merchants.module';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { LedgerModule } from '../ledger/ledger.module';
import { BalancesModule } from '../balances/balances.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MerchantsModule,
    UsersModule,
    TokensModule,
    LedgerModule,
    BalancesModule,
    NotificationsModule,
  ],
  controllers: [RewardProgramsController],
  providers: [RewardProgramsService],
  exports: [RewardProgramsService],
})
export class RewardProgramsModule {}
