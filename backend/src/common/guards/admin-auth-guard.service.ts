import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from '../../tokens/tokens.service';
import { UserRole } from '../../users/types/user-role.enum';

export type DecodedToken = {
  id: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokensService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request & { admin?: any } = ctx.switchToHttp().getRequest();
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const token = header.slice('Bearer '.length);

    const decoded = await this.tokens.verifyAccessJwt<DecodedToken>(token);
    if (!decoded || decoded.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Invalid access token');
    }

    req.admin = { id: decoded.id, email: decoded.email };
    return true;
  }
}
