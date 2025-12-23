import * as dotenv from 'dotenv';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import helmet from 'helmet';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './common/configs/app.config';
import { ConfigName } from './common/types/enums/config-name.enum';
import { NodeEnvironment } from './common/types/enums/node-environment.enum';
import { apiReference } from '@scalar/nestjs-api-reference';
import * as cookieParser from 'cookie-parser';
import { BugsnagExceptionFilter } from './common/filters/bugsnag-exception.filter';
import { BUGSNAG_CLIENT } from './common/modules/bugsnag/bugsnag.module';

dotenv.config();

const logger = new Logger('App');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
  });

  setupGracefulShutdown({ app });

  const configService = app.get(ConfigService);

  const appConfig = configService.getOrThrow<IAppConfig>(ConfigName.APP);

  logger.log(`Starting API under "${appConfig.nodeEnv}" environment...`);

  const isDevelopmentEnvironment =
    appConfig.nodeEnv === NodeEnvironment.DEV ||
    appConfig.nodeEnv === NodeEnvironment.STAGE;
  const isLocalEnvironment = appConfig.nodeEnv === NodeEnvironment.LOCAL;

  const bugsnag = app.get(BUGSNAG_CLIENT);
  app.useGlobalFilters(new BugsnagExceptionFilter(bugsnag));

  app.enableCors({
    credentials: true,
    origin: [
      'https://dashboard-be4r.onrender.com',
      'https://dashboard-nye6.onrender.com',
      'https://admin-dashboard-mqv9.onrender.com',
      'https://admin-dashboard-stage-opww.onrender.com',
      'http://localhost:8080',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  if (isDevelopmentEnvironment || isLocalEnvironment) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': [
              "'self'",
              "'unsafe-eval'",
              'https://cdn.jsdelivr.net',
            ],
            'style-src': [
              "'self'",
              "'unsafe-inline'",
              'https://cdn.jsdelivr.net',
            ],
            'connect-src': ["'self'", 'https://cdn.jsdelivr.net'],
          },
        },
      }),
    );
  } else {
    app.use(helmet());
  }

  if (isDevelopmentEnvironment || isLocalEnvironment) {
    const swaggerConfigBuilder = new DocumentBuilder()
      .setTitle('RewardedApp')
      .setDescription('RewardedApp API description')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insert Firebase ID token (without "Bearer ")',
      });

    const document = SwaggerModule.createDocument(
      app,
      swaggerConfigBuilder.build(),
    );

    app.use(
      '/docs',
      apiReference({
        theme: 'saturn',
        spec: {
          content: document,
        },
      }),
    );
  }

  await app.listen(appConfig.port);

  logger.log(`API has successfully started at "${await app.getUrl()}"`);
}

bootstrap();
