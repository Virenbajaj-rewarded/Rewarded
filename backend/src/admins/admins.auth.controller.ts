import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AdminsService } from './admins.service';
import { TokensService } from '../tokens/tokens.service';
import { AdminAuthDto } from './dto/admin-auth.dto';
import { DAY } from '../common/constants/time';
import { IAppConfig } from '../common/configs/app.config';
import { ConfigService } from '@nestjs/config';
import { ConfigName } from '../common/types/enums/config-name.enum';
import { NodeEnvironment } from '../common/types/enums/node-environment.enum';
import { AccessTokenResponseDto } from './dto/access-token.response.dto';
import { SuccessResponseDto } from '../common/dto/success-response.dto';

@ApiTags('Admins')
@Controller('admins-auth')
export class AdminsAuthController {
  private readonly config: IAppConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly adminsService: AdminsService,
    private readonly tokensService: TokensService,
  ) {
    this.config = this.configService.getOrThrow<IAppConfig>(ConfigName.APP);
  }

  @Post('/auth')
  @ApiOperation({
    summary: 'Admin authorization (email + password)',
    description:
      'Authenticates admin using email and password. Returns JWT access/refresh token pair. Refresh token is automatically set as an HttpOnly cookie.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged in, returns access token',
    type: AccessTokenResponseDto,
    headers: {
      'Set-Cookie': {
        description:
          'HttpOnly refresh token cookie (long-lived). Example: refreshToken=abcdef; Path=/auth/refresh; HttpOnly; Secure; SameSite=None; Max-Age=2592000',
        schema: { type: 'string' },
      },
    },
  })
  async adminAuth(
    @Body() dto: AdminAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    const pair = await this.adminsService.login(dto.email, dto.password);

    res.cookie(this.tokensService.refreshCookieName, pair.refresh, {
      httpOnly: true,
      sameSite: this.config.nodeEnv === NodeEnvironment.PROD ? 'none' : 'lax',
      secure: this.config.nodeEnv === NodeEnvironment.PROD,
      maxAge: 30 * DAY,
    });

    return { accessToken: pair.access };
  }

  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh admin access token',
    description:
      'Refreshes admin access JWT token using the existing refresh token stored in cookies. Returns a new access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token successfully generated.',
    type: AccessTokenResponseDto,
  })
  async refresh(@Req() req: Request): Promise<AccessTokenResponseDto> {
    const refreshToken = req.cookies[this.tokensService.refreshCookieName];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const accessToken = await this.adminsService.refresh(refreshToken);
    return { accessToken };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout admin (clear refresh cookie)',
    description:
      'Clears the refresh token cookie, effectively logging out the admin. Access token should be discarded on the client side.',
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
    description: 'Refresh token cookie cleared successfully. Admin logged out.',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponseDto> {
    res.clearCookie(this.tokensService.refreshCookieName, {
      sameSite: 'none',
      secure: this.config.nodeEnv === NodeEnvironment.PROD,
      httpOnly: true,
    });

    return new SuccessResponseDto(true);
  }
}
