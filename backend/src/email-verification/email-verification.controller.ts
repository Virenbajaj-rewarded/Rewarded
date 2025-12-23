import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailVerificationService } from './email-verification.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import {
  ReqFirebase,
  Roles,
  SkipEmailVerificationCheck,
} from '../common/decorators';
import { UserRole } from '../users/types/user-role.enum';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Email')
@Controller('email')
@ApiBearerAuth()
@SkipEmailVerificationCheck()
@Roles(UserRole.USER)
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send email verification code',
    description:
      'Generates and sends a 6-digit verification code to the specified email. ' +
      'If a previous active code exists, it will be invalidated.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification code successfully sent via email.',
    type: SuccessResponseDto,
  })
  async sendCode(
    @ReqFirebase() user: DecodedIdToken,
  ): Promise<SuccessResponseDto> {
    return this.emailVerificationService.requestVerification(user);
  }

  @Post('resend')
  @ApiOperation({
    summary: 'Resend last verification code',
    description:
      'Generates and sends a new verification code to the previously email. ' +
      'Available only if there is an active pending verification request.',
  })
  @ApiResponse({
    status: 200,
    description: 'New verification code successfully sent via email.',
    type: SuccessResponseDto,
  })
  async resend(
    @ReqFirebase() user: DecodedIdToken,
  ): Promise<SuccessResponseDto> {
    return this.emailVerificationService.resendCode(user);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify email with received code',
    description:
      'Checks the provided 6-digit code for the given email. ' +
      'If valid, marks the email as confirmed in the user profile.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email successfully verified.',
    type: SuccessResponseDto,
  })
  async verify(
    @ReqFirebase() user: DecodedIdToken,
    @Body() dto: VerifyCodeDto,
  ): Promise<SuccessResponseDto> {
    return this.emailVerificationService.verifyCode(user, dto);
  }
}
