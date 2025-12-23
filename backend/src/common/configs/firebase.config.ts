import { registerAs } from '@nestjs/config';
import { ConfigName } from '../types/enums/config-name.enum';

export interface IFirebaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  apiKey: string;
}

export default registerAs(ConfigName.FIREBASE, () => {
  const requiredProps = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_API_KEY',
  ];

  for (const prop of requiredProps) {
    if (!process.env[prop]) {
      throw new Error(
        `Property "${prop}" is not configured in Firebase config`,
      );
    }
  }

  let privateKey = process.env.FIREBASE_PRIVATE_KEY as string;

  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const config: IFirebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey,
    apiKey: process.env.FIREBASE_API_KEY as string,
  };

  return config;
});
