import { Module } from '@nestjs/common';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import appConfig from './common/configs/app.config';
import firebaseConfig from './common/configs/firebase.config';
import { HealthModule } from './health/health.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { FirebaseModule } from './common/modules/firebase/firebase.module';
import { tokensConfig } from './common/configs/tokens.config';
import { AdminsModule } from './admins/admins.module';
import { MerchantsModule } from './merchants/merchants.module';
import sendgridConfig from './common/configs/sendgrid.config';
import s3Config from './common/configs/s3.config';
import { RewardProgramsModule } from './reward-programs/reward-programs.module';
import { LedgerModule } from './ledger/ledger.module';
import { BugsnagModule } from './common/modules/bugsnag/bugsnag.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: process.cwd() + `/.env`,
      load: [appConfig, firebaseConfig, sendgridConfig, tokensConfig, s3Config],
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
      },
    }),
    ThrottlerModule.forRoot({
      errorMessage: 'Too many requests',
      throttlers: [
        {
          ttl: seconds(60),
          limit: 300,
        },
      ],
    }),
    BugsnagModule,
    PrismaModule,
    FirebaseModule,
    HealthModule,
    UsersModule,
    EmailVerificationModule,
    AuthModule,
    AdminsModule,
    MerchantsModule,
    RewardProgramsModule,
    LedgerModule,
    PointsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
