import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ForgotPasswordService } from './forgot-password.service';
import { SendgridModule } from '../common/modules/sendgrid/sendgrid.module';

@Module({
  imports: [UsersModule, SendgridModule],
  controllers: [AuthController],
  providers: [AuthService, ForgotPasswordService],
  exports: [AuthService],
})
export class AuthModule {}
