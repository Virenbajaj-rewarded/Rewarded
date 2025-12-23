import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserResponseDto } from '../users/dto/create-user.response.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ReqFirebase, Roles } from '../common/decorators';
import { RegisterTokenGuard } from './guards/register-token-guard.service';
import { RegisterUserBodyDto } from './guards/register-user.body.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';
import { FirebaseAuthGuard, RolesGuard } from '../common/guards';
import { UserRole } from '../users/types/user-role.enum';
import {
  ForgotPasswordRequestDto,
  ForgotPasswordResetDto,
  ForgotPasswordVerifyDto,
} from './dto/forgot-password.dto';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('register')
  @UseGuards(RegisterTokenGuard)
  @ApiOperation({
    summary: 'Create or return existing user',
    description: 'Verifies Firebase ID token, creates or return existing user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile with role',
    type: CreateUserResponseDto,
  })
  async register(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Body() body: RegisterUserBodyDto,
  ): Promise<CreateUserResponseDto> {
    return this.authService.register(firebaseUser, body);
  }

  @Post('change-password')
  @Roles(UserRole.USER, UserRole.MERCHANT)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Requires Firebase token and verifies old password before updating.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    type: SuccessResponseDto,
  })
  async changePassword(
    @ReqFirebase() firebaseUser: DecodedIdToken,
    @Body() body: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    return this.authService.changePassword(firebaseUser, body);
  }

  @Post('forgot-password/request')
  @ApiOperation({
    summary: 'Request password reset code',
    description:
      'Sends a 6-digit password reset code to the specified email if the user exists.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset code successfully sent to email',
    type: SuccessResponseDto,
  })
  async request(
    @Body() dto: ForgotPasswordRequestDto,
  ): Promise<SuccessResponseDto> {
    return this.forgotPasswordService.requestReset(dto.email);
  }

  @Post('forgot-password/verify')
  @ApiOperation({
    summary: 'Verify password reset code',
    description:
      'Checks if a provided 6-digit reset code is valid and not expired.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification successful',
    type: SuccessResponseDto,
  })
  async verify(
    @Body() dto: ForgotPasswordVerifyDto,
  ): Promise<SuccessResponseDto> {
    return this.forgotPasswordService.verifyCode(dto.email, dto.code);
  }

  @Post('forgot-password/reset')
  @ApiOperation({
    summary: 'Reset password with verified code',
    description:
      'Resets the password for a user email after verifying the provided code.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset',
    type: SuccessResponseDto,
  })
  async reset(
    @Body() dto: ForgotPasswordResetDto,
  ): Promise<SuccessResponseDto> {
    return this.forgotPasswordService.resetPassword(
      dto.email,
      dto.code,
      dto.newPassword,
    );
  }
}
