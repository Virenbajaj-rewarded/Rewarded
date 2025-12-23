import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { FIREBASE_ADMIN } from '../common/modules/firebase/firebase.module';
import { SendgridService } from '../common/modules/sendgrid/sendgrid.service';
import * as admin from 'firebase-admin';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { VerificationType } from '@prisma/client';
import {
  CODE_TTL_MINUTES,
  RESEND_CODE_COOLDOWN_SEC,
} from '../common/constants/code-settings';
import { generate6DigitCode } from '../common/utils/generate-code';
import { forgotPasswordTemplate } from '../common/modules/sendgrid/templates/forgot-password.template';

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    @Inject(FIREBASE_ADMIN) private app: admin.app.App,
    private readonly sendgrid: SendgridService,
  ) {}

  async requestReset(email: string): Promise<SuccessResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    let fbUser;
    try {
      fbUser = await this.app.auth().getUserByEmail(email);
    } catch (err) {
      this.logger.error('Failed to fetch Firebase user by email', {
        email,
        message: err.message,
      });

      throw new BadRequestException(
        'Failed to verify account. Try again later.',
      );
    }

    if (fbUser.providerData[0]?.providerId !== 'password') {
      throw new BadRequestException(
        'Password reset not available for social logins',
      );
    }

    const latest = await this.prisma.emailVerification.findFirst({
      where: { userId: user.id, type: VerificationType.FORGOT_PASSWORD },
      orderBy: { createdAt: 'desc' },
    });

    if (latest) {
      const elapsed = (Date.now() - latest.createdAt.getTime()) / 1000;
      if (elapsed < RESEND_CODE_COOLDOWN_SEC) {
        throw new BadRequestException(
          `Please wait ${Math.ceil(
            RESEND_CODE_COOLDOWN_SEC - elapsed,
          )}s before requesting another code`,
        );
      }
    }

    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

    const created = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerification.updateMany({
        where: {
          type: VerificationType.FORGOT_PASSWORD,
          userId: user.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date() },
      });

      return tx.emailVerification.create({
        data: {
          type: VerificationType.FORGOT_PASSWORD,
          userId: user.id,
          code,
          expiresAt,
        },
      });
    });

    try {
      await this.sendgrid.send(
        user.email,
        'Password Reset Code',
        forgotPasswordTemplate(user.fullName, code),
      );
    } catch (error) {
      await this.prisma.emailVerification.delete({ where: { id: created.id } });
      this.logger.error(
        `Failed to forgot password email to ${user.email}`,
        error?.message,
      );
      throw new BadRequestException(
        'Failed to send email, please try again later',
      );
    }

    return new SuccessResponseDto(true);
  }

  async verifyCode(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const record = await this.prisma.emailVerification.findFirst({
      where: {
        type: VerificationType.FORGOT_PASSWORD,
        userId: user.id,
        code,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record)
      throw new BadRequestException('Invalid or expired verification code');

    return new SuccessResponseDto(true);
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const record = await this.prisma.emailVerification.findFirst({
      where: {
        type: VerificationType.FORGOT_PASSWORD,
        userId: user.id,
        code,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record)
      throw new BadRequestException('Invalid or expired verification code');

    await this.prisma.emailVerification.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    let firebaseUser;
    try {
      firebaseUser = await this.app.auth().getUserByEmail(email);
    } catch (err) {
      this.logger.error('Failed to fetch Firebase user', {
        email,
        message: err.message,
      });

      throw new BadRequestException(
        'Failed to verify account. Try again later.',
      );
    }

    try {
      await this.app.auth().updateUser(firebaseUser.uid, {
        password: newPassword,
      });
    } catch (err) {
      this.logger.error('Failed to update Firebase password', {
        uid: firebaseUser.uid,
        email,
        message: err.message,
      });

      throw new BadRequestException(
        'Failed to update user password. Try again later.',
      );
    }

    return new SuccessResponseDto(true);
  }
}
