import { Prisma } from '@prisma/client';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { BUGSNAG_CLIENT } from '../modules/bugsnag/bugsnag.module';
import { Client } from '@bugsnag/js';
import { Request, Response } from 'express';

@Catch()
export class BugsnagExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BugsnagExceptionFilter.name);

  constructor(
    @Inject(BUGSNAG_CLIENT) private readonly bugsnag: Client | null,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(`Prisma error: ${exception.message}`, exception.stack);

      status = 400;
      message = mapPrismaError(exception);

      this.safeNotify(exception, request, {
        prismaCode: exception.code,
        meta: exception.meta,
      });

      return response.status(status).json({ statusCode: status, message });
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error(`Prisma error: ${exception.message}`, exception.stack);

      status = 400;
      message = 'Invalid data provided for database operation';

      this.safeNotify(exception, request);
      return response.status(status).json({ statusCode: status, message });
    }

    if (exception instanceof HttpException) {
      this.logger.error(`HTTP error: ${exception.message}`, exception.stack);

      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : ((res as any)?.message ?? exception.message);

      if (status >= 500) {
        this.safeNotify(exception, request);
      }

      return response.status(status).json({ statusCode: status, message });
    }

    if (exception instanceof Error) {
      this.logger.error(`Error: ${exception.message}`, exception.stack);

      this.safeNotify(exception, request);
      return response.status(500).json({
        statusCode: 500,
        message: exception.message,
      });
    }

    this.safeNotify(exception, request);
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }

  private safeNotify(exception: any, request: Request, meta: any = {}) {
    if (!this.bugsnag) return;

    this.bugsnag.notify(exception, (event) => {
      event.addMetadata('request', {
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
      });

      if (Object.keys(meta).length) {
        event.addMetadata('details', meta);
      }
    });
  }
}

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): string {
  switch (err.code) {
    case 'P2002':
      return 'Record already exists (duplicate).';
    case 'P2003':
      return 'Trying to reference a related record that does not exist.';
    case 'P2025':
      return 'Record not found.';
    default:
      return 'Database error occurred.';
  }
}
