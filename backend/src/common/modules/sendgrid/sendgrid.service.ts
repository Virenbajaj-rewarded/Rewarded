import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISendGridConfig } from '../../configs/sendgrid.config';
import { ConfigService } from '@nestjs/config';
import { ConfigName } from '../../types/enums/config-name.enum';
import { SENDGRID_CLIENT } from './constants/sendgrid.tokens';

type SgClient = typeof import('@sendgrid/mail');

@Injectable()
export class SendgridService {
  private readonly logger = new Logger(SendgridService.name);

  private readonly config: ISendGridConfig;

  constructor(
    @Inject(SENDGRID_CLIENT) private readonly client: SgClient,
    private readonly configService: ConfigService,
  ) {
    this.config = this.configService.getOrThrow<ISendGridConfig>(
      ConfigName.SENDGRID,
    );
  }

  async send(to: string, subject: string, html: string) {
    try {
      await this.client.send({
        to,
        from: { email: this.config.fromEmail },
        subject,
        html,
      });
      this.logger.log(`SendGrid email sent to ${to} (${subject})`);
    } catch (error) {
      this.logger.error(`SendGrid error to ${to}: ${error?.message ?? error}`);
      throw error;
    }
  }
}
