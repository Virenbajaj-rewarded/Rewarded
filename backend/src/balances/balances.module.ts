import { forwardRef, Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [BalancesService],
  exports: [BalancesService],
})
export class BalancesModule {}
