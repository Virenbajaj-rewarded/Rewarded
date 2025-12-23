import { Inject, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { IS3Config } from '../../configs/s3.config';
import { ConfigService } from '@nestjs/config';
import { ConfigName } from '../../types/enums/config-name.enum';
import { S3_CLIENT } from './constants/file-storage.tokens';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileStorageService {
  private readonly config: IS3Config;

  constructor(
    @Inject(S3_CLIENT) private readonly s3: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.getOrThrow<IS3Config>(ConfigName.S3);
  }

  async getReadUrl(key: string, expiresSeconds = 3600): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.config.bucket, Key: key }),
      { expiresIn: expiresSeconds },
    );
  }

  async upload(file: Express.Multer.File, folder = 'logos'): Promise<string> {
    const key = `${folder}/${uuid()}-${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }
}
