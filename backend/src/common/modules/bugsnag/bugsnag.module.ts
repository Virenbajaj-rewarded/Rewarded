import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';

export const BUGSNAG_CLIENT = 'BUGSNAG_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BUGSNAG_CLIENT,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const releaseStage = cfg.getOrThrow<string>(
          'BUGSNAG_RELEASE_STAGE',
          'dev',
        );

        if (releaseStage === 'local' || releaseStage === 'dev') {
          return null;
        }

        const client = Bugsnag.start({
          apiKey: cfg.getOrThrow<string>('BUGSNAG_API_KEY'),
          releaseStage,
          plugins: [bugsnagExpress],
          onError: (event) => {
            const req = (event as any).request;
            if (req?.headers) {
              delete req.headers.authorization;
            }
          },
        });

        return client;
      },
    },
  ],
  exports: [BUGSNAG_CLIENT],
})
export class BugsnagModule {}
