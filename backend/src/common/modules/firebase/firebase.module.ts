import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';
import firebaseConfig from '../../configs/firebase.config';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN,
      inject: [firebaseConfig.KEY],
      useFactory: (fbConf: ConfigType<typeof firebaseConfig>) => {
        const { projectId, clientEmail, privateKey } = fbConf;

        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      },
    },
  ],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseModule {}
