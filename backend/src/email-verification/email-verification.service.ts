import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { generate6DigitCode } from '../common/utils/generate-code';
import {
  CODE_TTL_MINUTES,
  RESEND_CODE_COOLDOWN_SEC,
} from '../common/constants/code-settings';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { SendgridService } from '../common/modules/sendgrid/sendgrid.service';
import { verificationCodeTemplate } from '../common/modules/sendgrid/templates/verification-code.template';
import { VerificationType } from '@prisma/client';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly sendGridService: SendgridService,
  ) {}

  async requestVerification(
    userData: DecodedIdToken,
  ): Promise<SuccessResponseDto> {
    const user = await this.usersService.findByFirebaseId(userData.uid);
    if (!user) throw new NotFoundException('User not found');

    if (user.email && user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    const latest = await this.prisma.emailVerification.findFirst({
      where: { userId: user.id, type: VerificationType.EMAIL_VERIFICATION },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    if (latest) {
      const secondsSinceLast =
        (Date.now() - new Date(latest.createdAt).getTime()) / 1000;
      if (secondsSinceLast < RESEND_CODE_COOLDOWN_SEC) {
        throw new Error(
          `Please wait ${Math.ceil(RESEND_CODE_COOLDOWN_SEC - secondsSinceLast)}s before requesting a new code`,
        );
      }
    }

    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

    const createdCode = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerification.updateMany({
        where: {
          type: VerificationType.EMAIL_VERIFICATION,
          userId: user.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date() },
      });

      return tx.emailVerification.create({
        data: {
          type: VerificationType.EMAIL_VERIFICATION,
          userId: user.id,
          code,
          expiresAt,
        },
      });
    });

    try {
      await this.sendGridService.send(
        user.email,
        `Verification code`,
        verificationCodeTemplate(user.fullName, code),
      );

      return new SuccessResponseDto(true);
    } catch (error) {
      await this.prisma.emailVerification.delete({
        where: { id: createdCode.id },
      });
      this.logger.error(
        `Failed to send email to ${user.email}`,
        error?.message,
      );
      throw new BadRequestException(
        'Failed to send email, please try again later',
      );
    }
  }

  async resendCode(userData: DecodedIdToken): Promise<SuccessResponseDto> {
    const user = await this.usersService.findByFirebaseId(userData.uid);
    if (!user) throw new NotFoundException('User not found');

    if (user.email && user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    const latestCode = await this.prisma.emailVerification.findFirst({
      where: { userId: user.id, type: VerificationType.EMAIL_VERIFICATION },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        consumedAt: true,
      },
    });

    if (latestCode) {
      const secondsSinceLast =
        (Date.now() - new Date(latestCode.createdAt).getTime()) / 1000;
      if (secondsSinceLast < RESEND_CODE_COOLDOWN_SEC) {
        throw new Error(
          `Please wait ${Math.ceil(RESEND_CODE_COOLDOWN_SEC - secondsSinceLast)}s before requesting a new code`,
        );
      }
    }

    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

    const createdCode = await this.prisma.$transaction(async (tx) => {
      await tx.emailVerification.updateMany({
        where: {
          type: VerificationType.EMAIL_VERIFICATION,
          userId: user.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { expiresAt: new Date() },
      });

      return tx.emailVerification.create({
        data: {
          type: VerificationType.EMAIL_VERIFICATION,
          userId: user.id,
          code,
          expiresAt,
        },
        select: { id: true },
      });
    });

    try {
      await this.sendGridService.send(
        user.email,
        `Verification code`,
        verificationCodeTemplate(user.fullName, code),
      );

      return new SuccessResponseDto(true);
    } catch (error) {
      await this.prisma.emailVerification.delete({
        where: { id: createdCode.id },
      });
      this.logger.error(
        `Failed to send email to ${user.email}`,
        error?.message,
      );
      throw new BadRequestException(
        'Failed to send email, please try again later',
      );
    }
  }

  async verifyCode(
    userData: DecodedIdToken,
    dto: VerifyCodeDto,
  ): Promise<SuccessResponseDto> {
    const { code } = dto;

    const user = await this.usersService.findByFirebaseId(userData.uid);
    if (!user) throw new NotFoundException('User not found');

    if (user.email && user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    const activeCode = await this.prisma.emailVerification.findFirst({
      where: {
        type: VerificationType.EMAIL_VERIFICATION,
        userId: user.id,
        code,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!activeCode) {
      throw new BadRequestException('Invalid code for this email');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: activeCode.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailConfirmed: true },
      }),
      this.prisma.emailVerification.updateMany({
        where: {
          type: VerificationType.EMAIL_VERIFICATION,
          userId: user.id,
          consumedAt: null,
          expiresAt: { gt: new Date() },
          id: { not: activeCode.id },
        },
        data: { expiresAt: new Date() },
      }),
    ]);

    return new SuccessResponseDto(true);
  }
}
