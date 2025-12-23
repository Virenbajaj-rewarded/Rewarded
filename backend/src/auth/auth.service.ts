import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserResponseDto } from '../users/dto/create-user.response.dto';
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserRole } from '../users/types/user-role.enum';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { MerchantStatus } from '@prisma/client';
import { RegisterUserBodyDto } from './guards/register-user.body.dto';
import { ConfigService } from '@nestjs/config';
import { IFirebaseConfig } from '../common/configs/firebase.config';
import { ConfigName } from '../common/types/enums/config-name.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import axios from 'axios';
import { FIREBASE_ADMIN } from '../common/modules/firebase/firebase.module';
import * as admin from 'firebase-admin';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly firebaseConfig: IFirebaseConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly users: UsersService,
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_ADMIN) private app: admin.app.App,
  ) {
    this.firebaseConfig = this.configService.getOrThrow<IFirebaseConfig>(
      ConfigName.FIREBASE,
    );
  }

  async register(
    decoded: DecodedIdToken,
    body?: RegisterUserBodyDto,
  ): Promise<CreateUserResponseDto> {
    const { uid, email, name, firebase } = decoded;

    if (!uid) throw new BadRequestException('Missing Firebase UID');
    if (!email)
      throw new BadRequestException('Missing email in Firebase token');

    const provider = firebase?.sign_in_provider ?? 'password';
    const isGoogle = provider === 'google.com';

    const fullName = isGoogle ? name : body?.fullName;
    const phone = isGoogle ? null : body?.phoneNumber;

    const user = await this.users.createOrReturnExistingOne({
      firebaseId: uid,
      email,
      fullName: fullName ?? null,
      phoneNumber: phone ?? null,
      isGoogleProvider: isGoogle,
    });

    if (user.role === UserRole.MERCHANT) return user;

    const merchant = await this.prisma.merchant.findFirst({
      where: { businessEmail: email },
    });

    if (!merchant) return user;

    if (merchant.status === MerchantStatus.PENDING) {
      throw new ForbiddenException(
        'Your profile is currently under review. It may take up to 48 hours.',
      );
    }

    if (merchant.status !== MerchantStatus.APPROVED) {
      return user;
    }

    const merchantRole = await this.users.getRoleByName(UserRole.MERCHANT);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          roleId: merchantRole.id,
          isEmailConfirmed: true,
          phone: merchant.businessPhoneNumber,
          fullName: merchant.fullName,
        },
      });

      await tx.merchant.update({
        where: { id: merchant.id },
        data: {
          userId: user.id,
        },
      });

      await tx.merchantOnboardingToken.updateMany({
        where: { merchantId: merchant.id },
        data: { used: true },
      });
    });

    return { ...user, role: UserRole.MERCHANT, isEmailConfirmed: true };
  }

  async changePassword(
    firebaseUser: DecodedIdToken,
    dto: ChangePasswordDto,
  ): Promise<SuccessResponseDto> {
    const { email, uid, firebase } = firebaseUser;
    if (!email) throw new BadRequestException('User email not found');

    if (firebase?.sign_in_provider !== 'password') {
      throw new BadRequestException(
        'Password change not allowed for social logins',
      );
    }

    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.firebaseConfig.apiKey}`,
        {
          email,
          password: dto.oldPassword,
          returnSecureToken: false,
        },
      );
    } catch {
      throw new BadRequestException('Old password is incorrect');
    }

    try {
      await this.app.auth().updateUser(uid, { password: dto.newPassword });
    } catch (err) {
      this.logger.error('Firebase password update error:', {
        uid,
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
