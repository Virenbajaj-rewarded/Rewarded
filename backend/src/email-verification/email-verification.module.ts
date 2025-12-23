import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { SendgridModule } from '../common/modules/sendgrid/sendgrid.module';

@Module({
  imports: [UsersModule, SendgridModule],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
