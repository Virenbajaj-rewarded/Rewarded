import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { SendgridService } from './sendgrid.service';
import sendgridConfig from '../../configs/sendgrid.config';
import { SENDGRID_CLIENT } from './constants/sendgrid.tokens';

@Module({
  providers: [
    {
      provide: SENDGRID_CLIENT,
      inject: [sendgridConfig.KEY],
      useFactory: (cfg: ConfigType<typeof sendgridConfig>) => {
        sgMail.setApiKey(cfg.apiKey);
        return sgMail;
      },
    },
    SendgridService,
  ],
  exports: [SendgridService],
})
export class SendgridModule {}
