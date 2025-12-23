import { registerAs } from '@nestjs/config';
import { ConfigName } from '../types/enums/config-name.enum';

export interface IS3Config {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export default registerAs(ConfigName.S3, (): IS3Config => {
  const requiredProps = [
    'AWS_BUCKET',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
  ] as const;

  for (const prop of requiredProps) {
    if (!process.env[prop]) {
      throw new Error(`Property "${prop}" is not configured in S3 config`);
    }
  }

  return {
    bucket: process.env.AWS_BUCKET!,
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  };
});
