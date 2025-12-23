import { registerAs } from '@nestjs/config';
import { ConfigName } from '../types/enums/config-name.enum';

export interface ITokensConfig {
  accessSecret: string;
  accessExpiresIn: string;

  refreshSecret: string;
  refreshExpiresIn: string;

  refreshTokenReqKey: string;
}

const getTokensConfig = (): ITokensConfig => {
  const props = [
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRES_IN',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES_IN',
    'JWT_REFRESH_TOKEN_REQ_KEY',
  ];

  for (const prop of props) {
    if (!process.env[prop]) {
      throw new Error(`[TokensConfig]: variable ${prop} is not configured`);
    }
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET!;
  const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN!;
  const refreshSecret = process.env.JWT_REFRESH_SECRET!;
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;
  const refreshTokenReqKey = process.env.JWT_REFRESH_TOKEN_REQ_KEY!;

  return {
    accessSecret,
    accessExpiresIn,
    refreshSecret,
    refreshExpiresIn,
    refreshTokenReqKey,
  };
};

export const tokensConfig = registerAs(ConfigName.TOKENS, getTokensConfig);
