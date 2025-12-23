import { Module } from '@nestjs/common';
import { BalancesModule } from '../balances/balances.module';
import { LedgerModule } from '../ledger/ledger.module';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [UsersModule, BalancesModule, LedgerModule, NotificationsModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
