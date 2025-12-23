import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { MerchantsAdminController } from './merchants.admin.controller';
import { TokensModule } from '../tokens/tokens.module';
import { SendgridModule } from '../common/modules/sendgrid/sendgrid.module';
import { UsersModule } from '../users/users.module';
import { FileStorageModule } from '../common/modules/file-storage/file-storage.module';

@Module({
  imports: [TokensModule, SendgridModule, FileStorageModule, UsersModule],
  controllers: [MerchantsController, MerchantsAdminController],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
