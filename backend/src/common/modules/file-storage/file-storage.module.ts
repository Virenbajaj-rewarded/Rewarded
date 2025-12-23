import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import s3Config from '../../configs/s3.config';
import { FileStorageService } from './file-storage.service';
import { S3_CLIENT } from './constants/file-storage.tokens';

@Module({
  providers: [
    {
      provide: S3_CLIENT,
      inject: [s3Config.KEY],
      useFactory: (cfg: ConfigType<typeof s3Config>) => {
        return new S3Client({
          region: cfg.region,
          credentials: {
            accessKeyId: cfg.accessKeyId,
            secretAccessKey: cfg.secretAccessKey,
          },
        });
      },
    },
    FileStorageService,
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
