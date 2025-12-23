import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokensConfig } from '../common/configs/tokens.config';
import { ConfigName } from '../common/types/enums/config-name.enum';
import { TTokens } from './types/tokens';

@Injectable()
export class TokensService {
  private config: ITokensConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.getOrThrow<ITokensConfig>(
      ConfigName.TOKENS,
    );
  }

  get refreshCookieName(): string {
    return this.config.refreshTokenReqKey;
  }

  async generateJwtPair(payload: Record<string, any>): Promise<TTokens> {
    const access = await this.generateAccessJwt(payload);
    const refresh = await this.generateRefreshJwt(payload);
    return { access, refresh };
  }

  async generateAccessJwt(payload: Record<string, any>): Promise<string> {
    const { accessSecret, accessExpiresIn } = this.config;
    return this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    });
  }

  async generateRefreshJwt(payload: Record<string, any>): Promise<string> {
    const { refreshSecret, refreshExpiresIn } = this.config;
    return this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });
  }

  async verifyAccessJwt<T extends object>(token: string): Promise<T | null> {
    try {
      const { accessSecret } = this.config;
      return await this.jwtService.verifyAsync<T>(token, {
        secret: accessSecret,
      });
    } catch {
      return null;
    }
  }

  async verifyRefreshJwt<T extends object>(token: string): Promise<T | null> {
    try {
      const { refreshSecret } = this.config;
      return await this.jwtService.verifyAsync<T>(token, {
        secret: refreshSecret,
      });
    } catch {
      return null;
    }
  }
}
