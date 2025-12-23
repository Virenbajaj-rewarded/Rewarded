import { Module } from '@nestjs/common';
import { AdminsAuthController } from './admins.auth.controller';
import { AdminsService } from './admins.service';
import { TokensModule } from '../tokens/tokens.module';
import { PrismaModule } from '../common/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TokensModule],
  controllers: [AdminsAuthController],
  providers: [AdminsService],
})
export class AdminsModule {}
