import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FileStorageModule } from '../common/modules/file-storage/file-storage.module';
import { BalancesModule } from '../balances/balances.module';

@Module({
  imports: [FileStorageModule, forwardRef(() => BalancesModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
