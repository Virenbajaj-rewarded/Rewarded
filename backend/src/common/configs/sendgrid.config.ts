import { registerAs } from '@nestjs/config';
import { ConfigName } from '../types/enums/config-name.enum';

export interface ISendGridConfig {
  apiKey: string;
  fromEmail: string;
}

export default registerAs(ConfigName.SENDGRID, (): ISendGridConfig => {
  const required = ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'] as const;

  for (const prop of required) {
    if (!process.env[prop]) {
      throw new Error(
        `Property "${prop}" is not configured in SendGrid config`,
      );
    }
  }

  return {
    apiKey: process.env.SENDGRID_API_KEY as string,
    fromEmail: process.env.SENDGRID_FROM_EMAIL as string,
  };
});
