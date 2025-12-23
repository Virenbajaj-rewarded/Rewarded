import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/modules/prisma/prisma.service';
import { Admin } from '@prisma/client';
import { TokensService } from '../tokens/tokens.service';
import { UserRole } from '../users/types/user-role.enum';
import { TTokens } from '../tokens/types/tokens';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
  ) {}

  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });

    if (!admin) throw new NotFoundException('Admin not found');

    return admin;
  }

  async validateCredentials(email: string, password: string): Promise<Admin> {
    const admin = await this.findByEmail(email);

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return admin;
  }

  async login(email: string, password: string): Promise<TTokens> {
    const admin = await this.validateCredentials(email, password);

    const payload = { id: admin.id, email: admin.email, role: UserRole.ADMIN };
    const pair = await this.tokensService.generateJwtPair(payload);

    return { refresh: pair.refresh, access: pair.access };
  }

  async refresh(refreshToken: string): Promise<string> {
    const decoded = await this.tokensService.verifyRefreshJwt<{
      id: string;
      email: string;
    }>(refreshToken);
    if (!decoded) throw new UnauthorizedException('Invalid refresh token');

    return this.tokensService.generateAccessJwt({
      id: decoded.id,
      email: decoded.email,
      role: UserRole.ADMIN,
    });
  }
}
